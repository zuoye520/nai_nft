import { ref, computed } from 'vue'

export function useNFTDetails(id) {
  const nft = ref({
    id,
    name: '',
    creator: '',
    image: '',
    price: 0,
    mintPrice: 0,
    totalSupply: 1000,
    mintedSupply: id > 2 ? 1000 : 600,
    mintPercent: 0,
    phase: id > 2 ? 'swap':'mint', // 'mint' or 'swap'
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

  const phase = computed(() => {
    const mintedPercentage = (nft.value.mintedSupply / nft.value.totalSupply) * 100
    return mintedPercentage >= 100 ? 'swap' : 'mint'
  })

  const mintProgress = computed(() => {
    return ((nft.value.mintedSupply / nft.value.totalSupply) * 100).toFixed(2)
  })

  const fetchNFTDetails = async () => {
    try {
      // Mock data - replace with actual API call
      nft.value = {
        id,
        name: 'Super NFT #1',
        creator: 'Creator Name',
        image: 'https://example.com/nft.jpg',
        price: '100',
        mintPrice: 10,
        totalSupply: 1000,
        mintedSupply: id > 2 ? 1000 : 600, // 60% minted
        mintPercent: 80,
        phase: id > 2 ? 'swap':'mint',
        description: 'NFT Description',
        buyFee: 2,
        sellFee: 2,
        volume: 1000,
        social: {
          twitter: 'https://x.com/example',
          telegram: 'https://t.me/example',
          website: 'https://example.com'
        }
      }
    } catch (error) {
      console.error('Error fetching NFT details:', error)
    }
  }

  return {
    nft,
    phase,
    mintProgress,
    fetchNFTDetails
  }
}