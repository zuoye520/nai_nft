import { sendRequest } from '../utils/httpUtils'
import { CHAINS, CURRENT_NETWORK } from '../config'

class WalletService {
  constructor() {
    this.NaboxWallet = window.NaboxWallet
    this.nabox = window.nabox
    this.session = null
    this.chainId = CURRENT_NETWORK.chainId
    this.chainName = 'NULS'
    this.isInitialized = false
  }

  // Check if NABOX wallet is installed
  isNaboxInstalled() {
    return typeof window.nabox !== 'undefined' && !!window.nabox
  }

  // Initialize wallet service
  async initialize() {
    if (this.isInitialized) return
    
    if (!this.isNaboxInstalled()) {
      throw new Error('NABOX wallet not installed')
    }

    try {
      // Create initial session
      this.session = await this.nabox.createSession()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize wallet service:', error)
      throw error
    }
  }

  // Connect wallet
  async connect() {
    await this.initialize()

    try {
      if (!this.session || !this.session[0]) {
        this.session = await this.nabox.createSession()
      }

      if (!this.session[0]) {
        throw new Error('No account found')
      }

      this.chainId = this.session[0].indexOf('tNULS') > -1 ? 2 : 1
      return this.session[0]
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw new Error(error.message || 'Failed to connect wallet')
    }
  }

  // Get connected account
  async getAccount() {
    if (!this.isNaboxInstalled()) return null

    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }
      this.chainId = this.session[0].indexOf('tNULS') > -1 ? 2 : 1
      return this.session[0]
    } catch (error) {
      console.warn('Failed to get account:', error)
      return null
    }
  }

  // Get account public key
  async getPub(accountAddress) {
    try {
      const accountPub = await this.nabox.getPub({ address: accountAddress })
      return accountPub
    } catch (error) {
      console.error('Failed to get public key:', error)
      throw error
    }
  }

  // Get chain information
  async getChainInfo() {
    if (!this.isNaboxInstalled()) {
      throw new Error('NABOX wallet not detected')
    }

    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }
      return {
        chainId: this.chainId,
        chainName: this.chainName
      }
    } catch (error) {
      console.error('Failed to get chain info:', error)
      throw error
    }
  }

  // Switch chain
  async switchChain() {
    if (!this.isNaboxInstalled()) {
      throw new Error('NABOX wallet not installed')
    }

    try {
      await this.nabox.switchChain({ chainId: CURRENT_NETWORK.chainId })
      this.chainId = CURRENT_NETWORK.chainId
    } catch (error) {
      console.error('Failed to switch chain:', error)
      throw error
    }
  }

  // Check network status
  async checkNetworkStatus() {
    if (!this.isNaboxInstalled()) {
      return { connected: false, chainId: null, error: 'No wallet installed' }
    }

    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }

      return {
        connected: true,
        chainId: this.chainId,
        error: null
      }
    } catch (error) {
      return {
        connected: false,
        chainId: null,
        error: error.message || 'Network connection failed'
      }
    }
  }

  // Get NULS balance
  async getNulsBalance(address) {
    if (!this.isNaboxInstalled()) return '0'

    try {
      if (!address && !this.session) {
        this.session = await this.nabox.createSession()
      }

      const accountAddress = address || this.session[0]
      const url = `${CHAINS[this.chainId].rpc}/api/accountledger/balance/${accountAddress}`
      const data = {
        assetChainId: this.chainId,
        assetId: 1
      }

      const response = await sendRequest(url, { method: 'post', data })
      if (!response.success) throw response
      return response.data.total
    } catch (error) {
      console.error('Failed to get balance:', error)
      return '0'
    }
  }

  // Event listeners
  onAccountsChanged(callback) {
    if (this.isNaboxInstalled()) {
      this.nabox.on('accountsChanged', (accounts) => {
        try {
          callback(accounts.length ? [accounts[0]] : [])
        } catch (error) {
          console.error('Account change handler failed:', error)
          callback([])
        }
      })
    }
  }

  onChainChanged(callback) {
    if (this.isNaboxInstalled()) {
      this.nabox.on('chainChanged', (chainId) => {
        try {
          const chainInfo = {
            chainId: chainId,
            chainName: this.chainName
          }
          this.chainId = chainId
          callback(chainInfo)
        } catch (error) {
          console.error('Chain change handler failed:', error)
        }
      })
    }
  }

  // Disconnect wallet
  disconnect() {
    this.removeListeners()
    this.session = null
    this.isInitialized = false
  }

  // Remove event listeners
  removeListeners() {
    if (this.isNaboxInstalled()) {
      try {
        this.nabox.removeAllListeners()
      } catch (error) {
        console.warn('Failed to remove event listeners:', error)
      }
    }
  }
}

export const walletService = new WalletService()