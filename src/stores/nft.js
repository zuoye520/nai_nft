import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../services/api'
import {fromAmount,formatUsd} from '../utils/format'
import { IPFS_GATEWAY,DEFAULT_AVATAR } from '../config'
export const useNftStore = defineStore('nft', () => {
  // NFT列表数据 Mock
  const nfts = ref([
    // {
    //   id: 1,
    //   name: 'GWEI Collection',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4',
    //   marketValue: '416.06',
    //   totalSupply: 1000,
    //   mintedSupply: 600
    // },
    // {
    //   id: 2,
    //   name: 'AddressFlow',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
    //   marketValue: '208.03',
    //   totalSupply: 1000,
    //   mintedSupply: 800
    // },
    // {
    //   id: 3,
    //   name: 'Kuleen Sideways',
    //   image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    //   marketValue: '978.00',
    //   totalSupply: 1000,
    //   mintedSupply: 1000
    // },
    // {
    //   id: 4,
    //   name: 'Princess K',
    //   image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    //   marketValue: '1444.00',
    //   totalSupply: 1000,
    //   mintedSupply: 400
    // },
    // {
    //   id: 5,
    //   name: 'ACCELERATE',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=5',
    //   marketValue: '208.03',
    //   totalSupply: 1000,
    //   mintedSupply: 200
    // },
    // {
    //   id: 6,
    //   name: 'Lmao NPC',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=6&backgroundColor=ffb238',
    //   marketValue: '156.02',
    //   totalSupply: 1000,
    //   mintedSupply: 100
    // },
    // {
    //   id: 7,
    //   name: 'Crypto Punks',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=7',
    //   marketValue: '325.50',
    //   totalSupply: 1000,
    //   mintedSupply: 750
    // },
    // {
    //   id: 8,
    //   name: 'Bored Apes',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=8',
    //   marketValue: '892.30',
    //   totalSupply: 1000,
    //   mintedSupply: 900
    // }
  ])
  const nftInfo = ref({
    id:'',
    name: '',
    creator: 'Nuls',
    image: '',
    price: 0,
    mintPrice: 0,
    totalSupply: 1000,
    mintedSupply: 600,//id > 2 ? 1000 : 600
    mintPercent: 0,
    phase: 'mint', // 'mint' or 'swap'
    description: '',
    buyFee: 0,
    sellFee: 0,
    volume: 0,
    social: {
      twitter: '',
      telegram: '',
      website: ''
    }
  })
  const listTotal = ref(0)
  // 持有的NFT Mock
  const heldNFTs = ref([
    // {
    //   id: 1,
    //   name: 'GWEI Collection',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4',
    //   marketValue: '416.06',
    //   totalSupply: 1000,
    //   mintedSupply: 600
    // },
    // {
    //   id: 2,
    //   name: 'AddressFlow',
    //   image: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
    //   marketValue: '208.03',
    //   totalSupply: 1000,
    //   mintedSupply: 800
    // }
  ])
  // 创建的NFT Mock
  const createdNFTs = ref([
    // {
    //   id: 3,
    //   name: 'Kuleen Sideways',
    //   image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    //   marketValue: '978.00',
    //   totalSupply: 1000,
    //   mintedSupply: 1000
    // }
  ])
  //持有NFT 前20名 Mock
  const nftHolders = ref([{
    // address: `NULS${Math.random().toString(16).slice(2, 42)}`,
    // avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${1}`,
    // balance: 0,
    // percentage: 0,
    // joinDate: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000
  }])
  //回复列表 Mock
  const repliesTotal = ref(0)
  const replies = ref([
    // {
    //   id: 1,
    //   author: 'User1',
    //   avatar: DEFAULT_AVATAR,
    //   content: 'Great NFT collection!',
    //   timestamp: Date.now() - 3600000,
    //   likes: 5
    // }
  ])
  
  //NFT txn Mock
  const transactionsTotal = ref(0)
  const transactions =ref([
    // {
    //   hash: '0x789...',
    //   type: 'Mint',
    //   from: '0xghi...',
    //   amount: 50,
    //   usdValue: 75,
    //   timestamp: Date.now() - 10800000,
    //   luckyBonus: 0
    // },
    // {
    //   hash: '0x101...',
    //   type: 'Swap',
    //   from: '0xjkl...',
    //   amount: 80,
    //   usdValue: 120,
    //   timestamp: Date.now() - 14400000,
    //   luckyBonus: 1
    // }
  ]) 
  //NFT价格走势
  const prices = ref([
    // {
    //     "time": 1736596801737,
    //     "price": "1"
    // },
    // {
    //     "time": 1736604360505,
    //     "price": "1.05"
    // },
    // {
    //     "time": 1736604382604,
    //     "price": "1.10"
    // },
    // {
    //     "time": 1736738636245,
    //     "price": "1.3"
    // },
    // {
    //     "time": 1736768943976,
    //     "price": "2"
    // },
])

  // 获取首页NFT列表
  async function getNFTs(params) {
    const result = await api.nftList(params);
    const list = result.list.map((item)=>{
      item.name = item.collectionName
      item.image = IPFS_GATEWAY + item.uri
      item.mintPercent = item.mintPercent/100 
      item.totalSupply = item.maxSupply
      item.mintedSupply = item.minted
      item.marketValue = item.projectState =='Swap'? fromAmount(item.minted * item.currentPrice) : fromAmount(item.minted * item.mintPrice) //市值
      return item
    })
    nfts.value = list;
  }
  // 获取NFT详情
  async function getNFTInfo(id) {
    const result = await api.nftInfo(id);
    result.creator = result.ownerAddress
    result.name = result.collectionName
    result.image = IPFS_GATEWAY + result.uri
    result.totalSupply = result.maxSupply
    result.mintedSupply = result.minted
    result.marketValue = result.projectState =='Swap' && result.currentPrice ? fromAmount(result.minted * result.currentPrice) : fromAmount(result.minted * result.mintPrice) //市值
    result.mintPrice = fromAmount(result.mintPrice)
    result.mintPercent = result.mintPercent/100 
    result.buyFee = result.buyFee/100 
    result.sellFee = result.sellFee/100 
    result.description = result.metadata.description
    result.social = result.metadata.social
    nftInfo.value = result;
  }
  //获取我持有的NFTs
  async function getHeldNFTs(params) {
    const result = await api.nftHeldList(params);
    const list = result.list.map((item)=>{
      item.name = item.collectionName
      item.image = IPFS_GATEWAY + item.uri
      item.mintPercent = item.mintPercent/100 
      item.totalSupply = item.maxSupply
      item.mintedSupply = item.minted
      item.marketValue = item.projectState =='Swap'? fromAmount(item.minted * item.currentPrice) : fromAmount(item.minted * item.mintPrice) //市值
      return item
    })
    listTotal.value = result.totalCount
    heldNFTs.value = list;
    return list;
  }
  //获取我创建的NFTs
  async function getCreatedNFTs(params) {
    const result = await api.nftCreatedList(params);
    const list = result.list.map((item)=>{
      item.name = item.collectionName
      item.image = IPFS_GATEWAY + item.uri
      item.mintPercent = item.mintPercent/100 
      item.totalSupply = item.maxSupply
      item.mintedSupply = item.minted
      item.marketValue = item.projectState =='Swap'? fromAmount(item.minted * item.currentPrice) : fromAmount(item.minted * item.mintPrice) //市值
      return item
    })
    listTotal.value = result.totalCount
    createdNFTs.value = list;
  }
  //获取top holders
  async function getNftHolders(id) {
    const result = await api.nftHolders(id);
    const list = result.map((item)=>{
      item.address = item.userAddress
      item.balance = item.nftHoldings
      item.percentage = item.nftHoldingRatio
      item.joinDate = item.createdDate
      item.avatar = DEFAULT_AVATAR
      return item
    })
    nftHolders.value = list;
  }
  //获取回复列表
  async function getNftReplyList(params) {
    const result = await api.nftReplyList(params);
    const list = result.list.map((item)=>{
      item.author = item.userAddress
      item.timestamp = item.createdDate
      item.avatar = DEFAULT_AVATAR
      return item
    })
    repliesTotal.value = result.totalCount
    replies.value = list;
  }
  //回复
  async function nftReply(params) {
    const result = await api.nftReply(params);
    return result;
  }
  
  //获取txn
  async function getNftTxn(params) {
    const result = await api.nftTxn(params);
    const list = result.list.map((item)=>{
      item.txHash = item.txHash
      item.type = item.txType =='Swap' ? item.tradeDirection: item.txType
      item.from = item.userAddress
      item.amount = fromAmount(item.amount)
      item.luckyBonus = item.luckyBonus && fromAmount(item.luckyBonus)
      item.usdValue = 0
      item.timestamp = item.createdDate
      return item
    })
    transactionsTotal.value = result.totalCount
    transactions.value = list;
  }
  //获取价走势
  async function getNftPrice(id) {
    let result = await api.nftPrice(id);
    result = result.map((item)=>{
      item.price = fromAmount(item.price)
      return item
    })
    prices.value = result;
  }

  return {
    nfts,
    nftInfo,
    nftHolders,
    replies,
    transactions,
    prices,
    listTotal,
    heldNFTs,
    createdNFTs,
    getNFTs,
    getNFTInfo,
    getNftHolders,
    getNftReplyList,
    repliesTotal,
    nftReply,
    transactionsTotal,
    getNftTxn,
    getNftPrice,
    getHeldNFTs,
    getCreatedNFTs,
    
  }
})