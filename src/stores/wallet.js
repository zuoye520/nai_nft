import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { walletService } from '../services/wallet'
import * as api from '../services/api'
import { fromAmount, formatUsd } from '../utils/format'
import { CHAINS, NABOX_DOWNLOAD_URL, CURRENT_NETWORK } from '../config'

export const useWalletStore = defineStore('wallet', () => {
  // State
  const account = ref(null)
  const accountPub = ref(null)
  const chainInfo = ref(null)
  const networkStatus = ref({ connected: false, chainId: null, error: null })
  const isConnecting = ref(false)
  const error = ref(null)
  const nulsBalance = ref(0)
  const nulsUsdPrice = ref(0)
  const domains = ref([])
  const primaryDomain = ref('')
  const userUri = ref('')
  const totalRewards = ref('0')
  const totalRewardsUsd = ref('0')
  const unclaimedRewards = ref('0')
  const unclaimedRewardsUsd = ref('0')
  const dataPollingInterval = ref(null)

  const showWalletModal = ref(false)
  // Computed
  const isConnected = computed(() => !!account.value)
  const shortAddress = computed(() => {
    if (!account.value) return ''
    return `${account.value.slice(0, 6)}...${account.value.slice(-4)}`
  })
  const primaryDomainOmit = computed(() => {
    if (!primaryDomain.value) return ''
    return primaryDomain.value.length > 20 
      ? `${primaryDomain.value.slice(0, 4)}...${primaryDomain.value.slice(-8)}`
      : primaryDomain.value
  })
  const currentChainConfig = computed(() => {
    if (!chainInfo.value?.chainId) return null
    return CHAINS[chainInfo.value.chainId]
  })

 
  // Methods
  function toggleWalletModal() {
    showWalletModal.value = !showWalletModal.value
  }
  async function connect() {
    if (!walletService.isNaboxInstalled()) {
      error.value = 'Please install NABOX wallet'
      window.open(NABOX_DOWNLOAD_URL, '_blank')
      return
    }

    try {
      isConnecting.value = true
      error.value = null

      // 1. Connect wallet and get account
      account.value = await walletService.connect()
      
      // 2. Get account public key
      accountPub.value = await walletService.getPub(account.value)
      
      // 3. Get chain info and verify network
      chainInfo.value = await walletService.getChainInfo()
      
      // 4. Switch to correct network if needed
      if (chainInfo.value.chainId !== CURRENT_NETWORK.chainId) {
        await walletService.switchChain()
        chainInfo.value = await walletService.getChainInfo()
      }

      // 5. Setup event listeners
      setupEventListeners()
      
      // 6. Start data polling
      startDataPolling()

      // 7. Load initial data
      await Promise.all([
        checkNetwork(),
        loadUserData()
      ])

    } catch (err) {
      console.error('Wallet connection failed:', err)
      error.value = err.message || 'Failed to connect wallet'
      disconnect()
    } finally {
      isConnecting.value = false
    }
  }

  async function loadUserData() {
    try {
      await Promise.all([
        getBalance(),
        getNulsUsdPrice(),
        loadDomains(),
        loadRewards()
      ])
    } catch (err) {
      console.error('Failed to load user data:', err)
    }
  }

  function startDataPolling() {
    // // Clear existing interval if any
    // if (dataPollingInterval.value) {
    //   clearInterval(dataPollingInterval.value)
    // }

    // // Start new polling interval
    // dataPollingInterval.value = setInterval(async () => {
    //   if (isConnected.value) {
    //     await loadUserData()
    //   }
    // }, 5000)
  }

  function setupEventListeners() {
    // Handle account changes
    walletService.onAccountsChanged(async (accounts) => {
      if (accounts[0]) {
        account.value = accounts[0]
        accountPub.value = await walletService.getPub(accounts[0])
        await loadUserData()
      } else {
        disconnect()
      }
    })

    // Handle network changes
    walletService.onChainChanged(async (newChainInfo) => {
      try {
        chainInfo.value = newChainInfo
        await checkNetwork()
        
        if (isConnected.value) {
          await loadUserData()
        }
      } catch (err) {
        console.error('Chain update failed:', err)
        disconnect()
      }
    })
  }

  async function checkNetwork() {
    const status = await walletService.checkNetworkStatus()
    networkStatus.value = status

    // Auto-switch network if needed
    if (status.connected && status.chainId !== CURRENT_NETWORK.chainId) {
      try {
        await walletService.switchChain()
        chainInfo.value = await walletService.getChainInfo()
      } catch (err) {
        error.value = 'Failed to switch network'
        console.error('Network switch failed:', err)
      }
    }
  }

  function disconnect() {
    // Clear all state
    account.value = null
    accountPub.value = null
    chainInfo.value = null
    error.value = null
    networkStatus.value = { connected: false, chainId: null, error: null }
    domains.value = []
    primaryDomain.value = ''
    userUri.value = ''

    // Clear polling interval
    if (dataPollingInterval.value) {
      clearInterval(dataPollingInterval.value)
      dataPollingInterval.value = null
    }

    // Disconnect wallet service
    walletService.disconnect()
    toggleWalletModal()
  }

  // Auto-connect on init
  async function init() {
    if (walletService.isNaboxInstalled()) {
      try {
        const currentAccount = await walletService.getAccount()
        if (currentAccount) {
          await connect()
        }
      } catch (err) {
        console.warn('Auto-connect failed:', err)
      }
    }
  }

  // Rest of the store methods...
  // Keep existing methods but remove their interval logic
  
  return {
    // State
    account,
    accountPub,
    chainInfo,
    networkStatus,
    isConnecting,
    error,
    nulsBalance,
    nulsUsdPrice,
    domains,
    primaryDomain,
    userUri,
    totalRewards,
    totalRewardsUsd,
    unclaimedRewards,
    unclaimedRewardsUsd,

    // Computed
    isConnected,
    shortAddress,
    primaryDomainOmit,
    currentChainConfig,

    // Methods
    connect,
    disconnect,
    init,
    checkNetwork,
    showWalletModal,
    toggleWalletModal,
    // ... rest of the existing methods
  }
})