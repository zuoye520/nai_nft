// 网络配置
export const CHAINS = {
  1: {
    chainId: 1,
    name: 'NULS',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://api.nuls.io', 
    explorer: 'https://nulscan.io',
    contracts: {
      domainAddress:'tNULSeBaMvEtDfvZuukDf2mVyfGo3DdiN8KLRG',
      nrc721Address: 'tNULSeBaN2inyAkyfk7AW5uAUf6cQr4BGSZCCt',
      stakeAddress:'tNULSeBaMx7ZoVNUyf6HHCySkmumRFsajahL2P'
    }
  },
  2: {
    chainId: 2,
    name: 'NULS Testnet',
    symbol: 'NULS',
    decimals: 8,
    rpc: 'https://beta.api.nuls.io', 
    explorer: 'https://beta.nulscan.io',
    contracts: {
      domainAddress:'tNULSeBaN6PdzE7zLsLDCEpLAUnMZMCREV27f4',
      nrc721Address: 'tNULSeBaNAKi6YYeoLPmQEjvtPhYeTRd6MZzfE',
      stakeAddress:'tNULSeBaN9ivFT3AHDMcBkDcWAuJ4ptQkxoio7'
    }
  }
}
// 当前环境配置
export const CURRENT_NETWORK = import.meta.env.VITE_APP_ENV === 'mainnet' 
  ? CHAINS[1]
  : CHAINS[2]
//https://app.pinata.cloud/ 配置
export const IPFS_CONFIG = {
  apiKey: "60dd3f8d985638706a26",
  apiSecret: "e6bef01c83276448ad5bbea9b144b6d6835d074e1baab40f6b3eb66c5076335f",
  gateway:"maroon-necessary-wallaby-5.mypinata.cloud",
  jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiZTc5MzM4ZC1hYTJkLTRkYWYtYWIzZi0zMDBmYjg0NDlhMjUiLCJlbWFpbCI6Inp6ODc3MjAwNzcyQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI2MGRkM2Y4ZDk4NTYzODcwNmEyNiIsInNjb3BlZEtleVNlY3JldCI6ImU2YmVmMDFjODMyNzY0NDhhZDViYmVhOWIxNDRiNmQ2ODM1ZDA3NGUxYmFhYjQwZjZiM2ViNjZjNTA3NjMzNWYiLCJleHAiOjE3NjM5MDU1Mzl9.EwE2ATj18-USExEZ5Jb9cLAPSOo1yyh1xez1DcNJFAs"
}
//币安API URL
export const BINANCE_URL ="https://api.binance.com"
//NABOX下载链接
export const NABOX_DOWNLOAD_URL ="https://nabox.io"
export const TW_URL ="https://x.com/Nuls"
export const TG_URL ="http://t.me/Nulsio"
export const DC_URL ="http://discord.com/invite/aRCwbj47WN"
export const GITHUB_URL ="https://github.com/cobble586/NulsDomainContract"
//默认头像
export const DEFAULT_AVATAR = 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/NULS.png'


