import { defineStore } from 'pinia'
import { ref, computed, getCurrentInstance } from 'vue'
import copy from 'copy-to-clipboard';
import { walletService } from '../services/wallet'
import * as api from '../services/api'
import {fromAmount,formatUsd} from '../utils/format'

import { CHAINS ,NABOX_DOWNLOAD_URL} from '../config'

import { useAuthStore } from './auth';
export const useWalletStore = defineStore('wallet', () => {
  const authStore = useAuthStore();

  const intervalId = ref(null)
  const account = ref(null)
  const accountPub = ref(null)
  const chainInfo = ref(null)
  const networkStatus = ref({ connected: false, chainId: null, error: null })
  const isConnecting = ref(false)
  const error = ref(null)
  const nulsBalance = ref(0)
  const nulsUsdPrice = ref(0)

  //钱包弹层
  const showWalletModal = ref(false)
  function toggleWalletModal() {
    showWalletModal.value = !showWalletModal.value
  }
  const isConnected = computed(() => !!account.value)
  const shortAddress = computed(() => {
    if (!account.value) return ''
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
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
      //获取nonce值
      const nonce = await authStore.loginNonce(account.value)
      console.log('nonce:',nonce)
      //开始签名
      const signData = await walletService.nabox.signMessage(['12345', account.value])
      console.log('signData:',signData)

      // const user = await authStore.login({
      //   "address": account.value,
      //   "pubKey": accountPub.value,
      //   "nonce": nonce,
      //   "signData": signData,
      //   "inviteCode": ""
      // })
      // console.log('nonce:',nonce)

    } catch (err) {
      error.value = err.message || 'Failed to connect to wallet'
      console.error('Failed to connect to wallet:', err)
      account.value = null
      chainInfo.value = null
    } finally {
      isConnecting.value = false
    }
  }

  // async function getBalance(){
  //   const balance = await walletService.getNulsBalance();
  //   nulsBalance.value = balance
  //   return balance
  // }
  // async function getNulsUsdPrice(){
  //   const nulsUsd = await api.nulsUsd();
  //   nulsUsdPrice.value = nulsUsd
  //   return nulsUsd
  // }

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
    toggleWalletModal()
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
  async function copyAddress (){
    try {
      copy(account.value)
      console.log('copy ok')
      // Could add a toast notification here
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }
  function openExplorer() {
    if (account.value) {
      window.open(`${currentChainConfig.value.explorer}/address/info?address=${account.value}`, '_blank')
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
          // intervalId.value = setInterval(() => {
          //   getBalance()
          //   getNulsUsdPrice()
          //   loadRewards()
          // }, 5000);
          // loadDomains()
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
    shortAddress,
    getPub,
    connect,
    disconnect,
    copyAddress,
    openExplorer,
    init,
    checkNetwork,
    invokeView,
    contractCall,
    currentChainConfig,
    nulsBalance,
    nulsUsdPrice,
    uploadJson,
    uploadFile,
    getFile,
    showWalletModal,
    toggleWalletModal
  }
})