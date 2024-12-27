import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { walletService } from '../services/wallet'
import * as api from '../services/api'
import {fromAmount,formatUsd} from '../utils/format'

import { CHAINS ,NABOX_DOWNLOAD_URL} from '../config'
export const useWalletStore = defineStore('wallet', () => {
  const intervalId = ref(null)
  const account = ref(null)
  const accountPub = ref(null)
  const chainInfo = ref(null)
  const networkStatus = ref({ connected: false, chainId: null, error: null })
  const isConnecting = ref(false)
  const error = ref(null)
  const nulsBalance = ref(0)
  const nulsUsdPrice = ref(0)
  // 域名列表数据
  const domains = ref([])
  const primaryDomain = ref('')
  const userUri = ref('')

  // 奖励数据
  const totalRewards = ref('0')
  const totalRewardsUsd = ref('0')
  const unclaimedRewards = ref('0')
  const unclaimedRewardsUsd = ref('0')

  const isConnected = computed(() => !!account.value)
  const shortAddress = computed(() => {
    if (!account.value) return ''
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
  })
  const primaryDomainOmit = computed(() => {
    if (!primaryDomain.value) return ''
    else if(primaryDomain.value.length > 20) return `${primaryDomain.value.slice(0, 4)}...${primaryDomain.value.slice(-8)}`
    else return primaryDomain.value;
    
  })
  
  const currentChainConfig = computed(() => {
    if (!chainInfo.value) return ''
    return CHAINS[chainInfo.value.chainId*1];
  })

  async function connect() {
    if (!walletService.isNaboxInstalled()) {
      error.value = 'Please install NABOX wallet'
      // window.open(NABOX_DOWNLOAD_URL, '_blank')
      return;
    }
    try {
      isConnecting.value = true
      error.value = null
      account.value = await walletService.connect();
      console.log('account address:',account.value)
      accountPub.value = await walletService.getPub(account.value);
      console.log('account Pub:',accountPub.value)
      chainInfo.value = await walletService.getChainInfo()
      console.log('getChainInfo:',chainInfo.value)
      // 设置监听器
      setupEventListeners()
      // 检查网络状态
      await checkNetwork()

    } catch (err) {
      error.value = err.message || 'Failed to connect to wallet'
      console.error('Failed to connect to wallet:', err)
      account.value = null
      chainInfo.value = null
    } finally {
      isConnecting.value = false
    }
  }

  async function getBalance(){
    const balance = await walletService.getNulsBalance();
    // console.log('balance:',{balance,nulsUsd})
    nulsBalance.value = balance
    return balance
  }
  async function getNulsUsdPrice(){
    const nulsUsd = await api.nulsUsd();
    nulsUsdPrice.value = nulsUsd
    return nulsUsd
  }

  function setupEventListeners() {
    walletService.onAccountsChanged((accounts) => {
      account.value = accounts[0] || null
      if (!accounts[0]) {
        disconnect()
      }
    })

    walletService.onChainChanged(async () => {
      try {
        const info = await walletService.getChainInfo()
        chainInfo.value = info
        await checkNetwork()
      } catch (err) {
        console.error('Chain update failed:', err)
        disconnect()
      }
    })
  }

  async function checkNetwork() {
    const status = await walletService.checkNetworkStatus()
    networkStatus.value = status
    
    if (!status.connected || status.error) {
      error.value = status.error || 'Network connection failed'
    }
  }

  function disconnect() {
    account.value = null
    chainInfo.value = null
    error.value = null
    networkStatus.value = { connected: false, chainId: null, error: null }
    clearInterval(intervalId.value);
    walletService.disconnect()
  }
  async function getPub(accountAddress){
    try {
     return await walletService.getPub(accountAddress || account.value)
    } catch (error) {
      throw new Error(error)
    }
  }
  async function invokeView(data){
    try {
     return await walletService.nabox.invokeView(data)
    } catch (error) {
      throw new Error(error)
    }
  }
  async function contractCall(data){
    try {
     const result = await walletService.nabox.contractCall(data)
     console.log('contractCall result:',error)
     return result;
    } catch (error) {
      console.error('contractCall error:',error)
      throw new Error(error)
    }
  }
  async function uploadJson(data={}) {
    try {
      return await api.uploadJson(data)
     } catch (error) {
       throw new Error(error)
     }
  }
  async function uploadFile(file) {
    try {
      return await api.uploadFile(file)
     } catch (error) {
       throw new Error(error)
     }
  }
  async function getFile(hash) {
    try {
      return await api.getFile(hash)
     } catch (error) {
       throw new Error(error)
     }
  }
  async function loadDomains() {
    try {
      const data = {
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "userDomains",
        methodDesc: "",
        args: [account.value]
      }
      let result = await invokeView(data)
      if(!result.result) throw result;
      result = JSON.parse(result.result)
      console.log('result:',result)
      if(!result) return;
      const activeDomains = result.activeDomains.map(domain=>({
        name:domain,
        isPrimary:result.mainDomain === domain?true:false,
        rewardsActive:true,
        showActions: false
      }))
      const inactiveDomains = result.inactiveDomains.map(domain=>({
        name:domain,
        isPrimary:result.mainDomain === domain?true:false,
        rewardsActive:false,
        showActions: false
      }))
      primaryDomain.value = result.mainDomain;
      userUri.value = result.uri;
      domains.value = [...activeDomains,...inactiveDomains] 
      return domains;
    } catch (error) {
      console.log('loadDomains error:',error)
      return []
    }
    
  }
  async function loadRewards() {
    try {
      const data = {
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodDesc: "",
        args: [account.value]
      }
      const [received, pending] = await Promise.all([
        invokeView({...data, methodName: "getUserRewardReceived"}),
        invokeView({...data, methodName: "pendingAward"})
      ])
      console.log('Rewards:',{received:received.result,pending:pending.result})
      totalRewards.value = fromAmount(received.result)
      unclaimedRewards.value =  fromAmount(pending.result)
      // TODO: Add USD conversion
      totalRewardsUsd.value = formatUsd(totalRewards.value * nulsUsdPrice.value)
      unclaimedRewardsUsd.value = formatUsd(unclaimedRewards.value * nulsUsdPrice.value)
      return {
        totalRewards,
        unclaimedRewards,
        totalRewardsUsd,
        unclaimedRewardsUsd
      }
    } catch (error) {
      console.error('Failed to load rewards:', error)
      throw new Error(error)
    } 
  }
  async function loadUserProfile(){
    if(!account.value) return;
    try {
      const {result} = await invokeView({
        contractAddress: currentChainConfig.value.contracts.domainAddress,
        methodName: "userURI",
        args: [account.value]
      })
      console.log('userURI:',result)
      userUri.value = result || ''
      if(!result) return;
      const {data:userProfile} = await getFile(userUri.value)
      
      console.log('userProfile:',userProfile)
      // if (userProfile) {
      //   description.value = userProfile.description || ''
      //   location.value = userProfile.location || ''
      //   socials.value = userProfile.socials || { twitter: '', discord: '', farcaster: '', github: '' }
      //   websites.value = userProfile.websites || ['', '', '']
      //   if (userProfile.avatarUrl) {
      //     avatarUrl.value = userProfile.avatarUrl
      //     avatarUriHash.value = userProfile.avatarUriHash
      //   }
      // }
      return userProfile
    } catch (error) {
      console.error('Failed to load profile:', error)
      // toast.show('Failed to load profile', 'error')
      return;
    }
  }
  
  // 初始化钱包
  async function init() {
    if (walletService.isNaboxInstalled()) {
      try {
        //切换到指定网络
        await walletService.switchChain()
        const currentAccount = await walletService.getAccount()
        if (currentAccount) {
          account.value = currentAccount;
          accountPub.value = await walletService.getPub(currentAccount);
          chainInfo.value = await walletService.getChainInfo();
          console.log('walletInfo:',{...chainInfo.value,...{currentAccount:account.value,accountPub:accountPub.value}});
          await checkNetwork()
          setupEventListeners()
          //定时拉取数据,退出钱包需要清除定时任务
          intervalId.value = setInterval(() => {
            getBalance()
            getNulsUsdPrice()
            loadRewards()
          }, 5000);
          loadDomains()
          // setInterval(getBalance,5000)
          // setInterval(getNulsUsdPrice,5000)
          // setInterval(loadRewards,5000)
          // setInterval(loadDomains,5000)
        }
      } catch (err) {
        console.warn('Wallet initialization failed:', err)
        disconnect()
      }
    }
  }

  return {
    account,
    accountPub,
    chainInfo,
    networkStatus,
    isConnecting,
    error,
    isConnected,
    userUri,
    primaryDomain,
    primaryDomainOmit,
    shortAddress,
    getPub,
    connect,
    disconnect,
    init,
    checkNetwork,
    invokeView,
    contractCall,
    currentChainConfig,
    nulsBalance,
    nulsUsdPrice,
    domains,
    loadDomains,
    loadRewards,
    totalRewards,
    totalRewardsUsd,
    unclaimedRewards,
    unclaimedRewardsUsd,
    uploadJson,
    uploadFile,
    getFile,
    loadUserProfile
  }
})