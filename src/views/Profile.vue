<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div class="flex items-center space-x-4">
          <img 
            :src="generateAvatarUrl(store.address)" 
            :alt="shortenAddress(store.address)"
            class="w-16 h-16 rounded-full"
          />
          <div>
            <h1 class="text-2xl font-bold text-white">{{ shortenAddress(store.address) }}</h1>
            <div class="flex items-center space-x-2 mt-1">
              <button 
                @click="copyAddress"
                class="text-sm text-gray-400 hover:text-green-400 flex items-center space-x-1"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              <a 
                :href="`https://nulscan.io/address/info?address=${store.address}`" 
                target="_blank"
                class="text-sm text-gray-400 hover:text-green-400 flex items-center space-x-1"
              >
                <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                <span>View on NULS Explorer</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <div class="mt-8 border-b border-gray-800">
        <nav class="flex space-x-8">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="py-4 px-1 relative"
            :class="[
              activeTab === tab.id 
                ? 'text-green-400' 
                : 'text-gray-400 hover:text-gray-300'
            ]"
          >
            {{ tab.name }}
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-blue-500"
              :class="{ 'opacity-100': activeTab === tab.id, 'opacity-0': activeTab !== tab.id }"
            />
          </button>
        </nav>
      </div>

      <!-- NFT Grid -->
      <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <NFTCard 
          v-for="nft in displayedNFTs" 
          :key="nft.id" 
          :nft="nft"
        />
      </div>

      <!-- Empty State -->
      <div v-if="displayedNFTs.length === 0" class="text-center py-12">
        <div class="text-gray-400">No NFTs found</div>
        <router-link 
          v-if="activeTab === 'created'" 
          to="/create"
          class="inline-block mt-4 px-6 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
        >
          Create Your First NFT
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWalletStore } from '../stores/wallet'
import { DocumentDuplicateIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import NFTCard from '../components/NFTCard.vue'

const store = useWalletStore()
const activeTab = ref('held')

const tabs = [
  { id: 'held', name: 'NFTs Held' },
  { id: 'created', name: 'NFTs Created' }
]

// Mock NFT data
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

const displayedNFTs = computed(() => {
  return activeTab.value === 'held' ? heldNFTs.value : createdNFTs.value
})

const generateAvatarUrl = (address) => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
}

const shortenAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 8)}...${address.slice(-4)}`
}

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(store.address)
    // Could add a toast notification here
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}
</script>