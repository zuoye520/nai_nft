<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Profile Header -->
      <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div class="flex items-center space-x-4">
          <img 
            :src="proxy.$config.DEFAULT_AVATAR" 
            class="w-16 h-16 rounded-full"
          />
          <div>
            <h1 class="text-2xl font-bold text-white">{{ store.shortAddress }}</h1>
            <div class="flex items-center space-x-2 mt-1">
              <button 
                @click="store.copyAddress"
                class="text-sm text-gray-400 hover:text-green-400 flex items-center space-x-1"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
                <span>Copy Address</span>
              </button>
              <button 
                @click="store.openExplorer"
                class="text-sm text-gray-400 hover:text-green-400 flex items-center space-x-1"
              >
                <ArrowTopRightOnSquareIcon class="w-4 h-4" />
                <span>View on NULS Explorer</span>
              </button>
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
import { ref, onMounted,onBeforeMount,computed,getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
const { proxy } = getCurrentInstance();

import { DocumentDuplicateIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import NFTCard from '../components/NFTCard.vue'
import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()
import { useNftStore } from '../stores/nft'
const nftStore = useNftStore()
const { heldNFTs,createdNFTs } = storeToRefs(nftStore)

const activeTab = ref('held')
const tabs = [
  { id: 'held', name: 'NFTs Held' },
  { id: 'created', name: 'NFTs Created' }
]
const displayedNFTs = computed(() => {
  return activeTab.value === 'held' ? heldNFTs.value : createdNFTs.value
})

onBeforeMount(() => {
  console.log('Component will be mounted')
})
onMounted(() => {
  // initData()
})
const initData = ()=>{
  nftStore.getHeldNFTs()
  nftStore.getCreatedNFTs()
}

</script>