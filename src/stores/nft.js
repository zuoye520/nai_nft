import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../services/api'

export const useNftStore = defineStore('nft', () => {
  // NFT列表数据 Mock
  const nfts = ref([
    {
      id: 1,
      name: 'GWEI Collection',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4',
      marketValue: '416.06',
      totalSupply: 1000,
      mintedSupply: 600
    },
    {
      id: 2,
      name: 'AddressFlow',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
      marketValue: '208.03',
      totalSupply: 1000,
      mintedSupply: 800
    },
    {
      id: 3,
      name: 'Kuleen Sideways',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      marketValue: '978.00',
      totalSupply: 1000,
      mintedSupply: 1000
    },
    {
      id: 4,
      name: 'Princess K',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
      marketValue: '1444.00',
      totalSupply: 1000,
      mintedSupply: 400
    },
    {
      id: 5,
      name: 'ACCELERATE',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=5',
      marketValue: '208.03',
      totalSupply: 1000,
      mintedSupply: 200
    },
    {
      id: 6,
      name: 'Lmao NPC',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=6&backgroundColor=ffb238',
      marketValue: '156.02',
      totalSupply: 1000,
      mintedSupply: 100
    },
    {
      id: 7,
      name: 'Crypto Punks',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=7',
      marketValue: '325.50',
      totalSupply: 1000,
      mintedSupply: 750
    },
    {
      id: 8,
      name: 'Bored Apes',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=8',
      marketValue: '892.30',
      totalSupply: 1000,
      mintedSupply: 900
    }
  ])

  // 持有的NFT Mock
  const heldNFTs = ref([
    {
      id: 1,
      name: 'GWEI Collection',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4',
      marketValue: '416.06',
      totalSupply: 1000,
      mintedSupply: 600
    },
    {
      id: 2,
      name: 'AddressFlow',
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=2',
      marketValue: '208.03',
      totalSupply: 1000,
      mintedSupply: 800
    }
  ])
  //创建的NFT Mock
  const createdNFTs = ref([
    {
      id: 3,
      name: 'Kuleen Sideways',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
      marketValue: '978.00',
      totalSupply: 1000,
      mintedSupply: 1000
    }
  ])

  //获取首页NFT列表
  async function getNFTs() {
    const result = await api.nftList();
    nfts.value = result.list;
  }
  //获取我持有的NFTs
  async function getHeldNFTs() {
    const result = await api.nftHeldList();
    nfts.value = result.list;
  }
  //获取我创建的NFTs
  async function getCreatedNFTs() {
    const result = await api.nftCreatedList();
    nfts.value = result.list;
  }

  return {
    nfts,
    heldNFTs,
    createdNFTs,
    getNFTs,
    getHeldNFTs,
    getCreatedNFTs
  }
})