// NABOX Wallet Service for NULS Network
import { sendRequest } from '../utils/httpUtils'
import { CHAINS,CURRENT_NETWORK } from '../config'
class WalletService {
  constructor() {
    this.NaboxWallet = window.NaboxWallet
    this.nabox = window.nabox
    this.session = null
    this.chainId = CURRENT_NETWORK.chainId
    this.chainName = 'NULS'
  }

  // 检查是否安装了 NABOX 钱包
  isNaboxInstalled() {
    return typeof window.nabox !== 'undefined' && !!window.nabox
  }

  // 连接 NABOX 钱包
  async connect() {
    if (!this.isNaboxInstalled()) {
      throw new Error('Please install NABOX wallet first')
    }

    try {
      // 创建 NULS 网络会话
      this.session = await this.nabox.createSession()
      console.log('this.session:',this.session)
      if (!this.session || !this.session[0]) {
        throw new Error('Account not found')
      }
      this.chainId = this.session[0].indexOf('tNULS') >-1 ? 2:1 

      return this.session[0]
    } catch (error) {
      console.error('Failed to connect to NABOX:', error)
      throw new Error(error.message || 'Failed to connect to wallet, please try again')
    }
  }
  
  // 获取已连接的账户
  async getAccount() {
    if (!this.isNaboxInstalled()) {
      return null
    }
    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }
      this.chainId = this.session[0].indexOf('tNULS') >-1 ? 2:1 
      return this.session[0]
    } catch (error) {
      console.warn('Failed to obtain NABOX account:', error)
      return null
    }
  }
  async getPub(accountAddress){
    try {
      const accountPub = await nabox.getPub({address:accountAddress});
      console.log('accountPub:',accountPub);
      return accountPub;
    } catch (error) {
      console.error('Failed to obtain public key:', error)
      return null
    }
    
  }
  // 获取链信息
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
      console.error('Failed to obtain chain information:', error)
      throw new Error('Failed to obtain chain information')
    }
  }

  // 发送交易
  async sendTransaction(transaction) {
    if (!this.isNaboxInstalled()) {
      throw new Error('Please install NABOX wallet first')
    }

    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }

      const txHash = await this.session.sendTransaction(transaction)
      return txHash
    } catch (error) {
      console.error('Send transaction failed:', error)
      throw new Error(error.message || 'Send transaction failed')
    }
  }

  // 监听账户变更
  onAccountsChanged(callback) {
    if (this.isNaboxInstalled()) {
      this.nabox.on('accountsChanged', (accounts) => {
        console.log('accountsChanged:',accounts)
        try {
          if (accounts.length) {
            callback([accounts[0]])
          } else {
            callback([])
          }
        } catch (error) {
          console.error('Account change processing failed:', error)
          callback([])
        }
      })
    }
  }

  // 监听链变更
  onChainChanged(callback) {
    if (this.isNaboxInstalled()) {
      this.nabox.on('chainChanged', (chainId) => {
        try {
          console.log('onChainChanged:',chainId)
          const chainInfo = {
            chainId: chainId,
            chainName: this.chainName
          }
          callback(chainInfo)
        } catch (error) {
          console.error('Chain change processing failed:', error)
        }
      })
    }
  }

  // 移除事件监听
  removeListeners() {
    if (this.isNaboxInstalled()) {
      try {
        this.nabox.removeAllListeners()
        this.session = null
      } catch (error) {
        console.warn('Failed to remove event listener:', error)
      }
    }
  }
// 切换指定网络 chainId = 1/2
  async switchChain() {
    if (!this.isNaboxInstalled()) {
      return { connected: false, chainId: null, error: 'No wallet installed' }
    }
    try {
      console.log('switchChain:',CURRENT_NETWORK.chainId)
      await this.nabox.switchChain({chainId:CURRENT_NETWORK.chainId})
    } catch (error) {
      console.error(error)
    }
  }
  // 检查网络连接状态
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
        error: error.message || '网络连接失败'
      }
    }
  }

  // 获取 NULS 余额
  async getNulsBalance() {
    if (!this.isNaboxInstalled()) {
      return '0'
    }
    try {
      if (!this.session) {
        this.session = await this.nabox.createSession()
      }
      // 构建 API 请求 URL
      const url = `${CHAINS[this.chainId].rpc}/api/accountledger/balance/${this.session[0]}`;
      const data = {
        "assetChainId" : this.chainId,
        "assetId" : 1
      }
      // 发送请求
      const response = await sendRequest(url, { method: 'post',data:data });
      if(!response.success) throw response
      return response.data.total;
    } catch (error) {
      console.error('Failed to obtain balance:', error)
      return 0
    }
  }

  // 断开连接
  disconnect() {
    if (this.session) {
      this.session = null
    }
    this.removeListeners()
  }
  // 暴露Nabox对象
  
}

export const walletService = new WalletService()