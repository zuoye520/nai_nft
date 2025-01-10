<template>
  <main class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
        <div class="text-center">
          <h1 class="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <GradientText>THE WORLD'S FIRST</GradientText>
          </h1>
          
          <div class="mt-4 text-4xl md:text-6xl font-bold animate-fade-in animation-delay-200">
            <GradientText type="secondary">NFT</GradientText>
            <GradientText type="primary" class="ml-2">LIQUIDITY PROTOCOL</GradientText>
          </div>
          
          <p class="mt-8 text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in animation-delay-400">
            Trade, earn and manage NFT liquidity with our revolutionary protocol
          </p>
          
          <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-600">
            <CreateNFTButton />
            <BaseButton class="text-lg px-8 py-3">
              How it works?
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Market Section -->
      <div class="relative bg-black/80 backdrop-blur-xl" ref="marketSection">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <!-- Search and Filters -->
          <div class="mb-8 flex flex-col sm:flex-row gap-4">
            <div class="flex-1 relative">
              <input 
                type="text" 
                placeholder="Search NFT collections" 
                class="w-full bg-[#1A1B1E] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00ff87] transition-colors"
              >
            </div>
            <div class="flex gap-4">
              <button class="px-6 py-3 bg-[#1A1B1E] border border-gray-800 rounded-xl text-white hover:border-[#00ff87] transition-colors">
                Sort by ▾
              </button>
            </div>
          </div>

          <!-- NFT Grid - Updated to show 4 cards per row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <NFTCard 
              v-for="(nft, index) in nfts" 
              :key="nft.id" 
              :nft="nft"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 100}ms` }"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
  
</template>

<script setup>
import { ref, inject, getCurrentInstance, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
import { useNftStore } from '../stores/nft'
const nftStore = useNftStore()
const { nfts } = storeToRefs(nftStore)

// 获取全局配置
const { proxy } = getCurrentInstance()
import BaseButton from '../components/BaseButton.vue'
import NFTCard from '../components/NFTCard.vue'
import GradientText from '../components/GradientText.vue'
import CreateNFTButton from '../components/CreateNFTButton.vue'

onBeforeMount(() => {
  console.log('Component will be mounted')
})
onMounted(() => {
  console.log('Component mounted')
  initData()
})
//滑动到指定位置
const marketSection = ref(null)
const scrollToMarket = () => {
  marketSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const initData = ()=>{
  //获取NFT列表
  nftStore.getNFTs()
}
</script>