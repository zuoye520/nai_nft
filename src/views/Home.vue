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
              
              <router-link to="/how-it-works">How it works?</router-link>
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
                v-model="searchQuery"
                type="text" 
                placeholder="Search NFT collections" 
                @keyup.enter="handleSearch"
                class="w-full bg-[#1A1B1E] border border-gray-800 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:border-[#00ff87] transition-colors"
              >
              <!-- Clear button -->
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
            <div class="flex gap-4">
              <!-- Sort Dropdown -->
              <div class="relative">
                <button 
                  @click="toggleSort"
                  class="px-6 py-3 bg-[#1A1B1E] border border-gray-800 rounded-xl text-white hover:border-[#00ff87] transition-colors flex items-center gap-2"
                >
                  <ArrowsUpDownIcon class="w-5 h-5 text-gray-400" />
                  {{ sortOptions[selectedSort] }}
                  <ChevronDownIcon class="w-5 h-5" :class="{ 'rotate-180': showSortDropdown }" />
                </button>
                <!-- Dropdown Menu -->
                <div v-if="showSortDropdown" class="absolute right-0 mt-2 w-48 bg-[#1A1B1E] border border-gray-800 rounded-xl shadow-lg z-10">
                  <div class="py-1">
                    <button
                      v-for="(label, value) in sortOptions"
                      :key="value"
                      @click="selectSort(value)"
                      class="block w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center gap-2"
                    >
                      <ArrowUpIcon v-if="value === 'newest'" class="w-4 h-4" />
                      <ArrowDownIcon v-else class="w-4 h-4" />
                      {{ label }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Filter Dropdown -->
              <div class="relative">
                <button 
                  @click="toggleFilter"
                  class="px-6 py-3 bg-[#1A1B1E] border border-gray-800 rounded-xl text-white hover:border-[#00ff87] transition-colors flex items-center gap-2"
                >
                  <FunnelIcon class="w-5 h-5 text-gray-400" />
                  {{ filterOptions[selectedFilter] }}
                  <ChevronDownIcon class="w-5 h-5" :class="{ 'rotate-180': showFilterDropdown }" />
                </button>
                <!-- Dropdown Menu -->
                <div v-if="showFilterDropdown" class="absolute right-0 mt-2 w-48 bg-[#1A1B1E] border border-gray-800 rounded-xl shadow-lg z-10">
                  <div class="py-1">
                    <button
                      v-for="(label, value) in filterOptions"
                      :key="value"
                      @click="selectFilter(value)"
                      class="block w-full px-4 py-2 text-left text-white hover:bg-gray-800 flex items-center gap-2"
                    >
                      <Squares2X2Icon v-if="value === 'all'" class="w-4 h-4" />
                      <CurrencyDollarIcon v-else-if="value === 'mint'" class="w-4 h-4" />
                      <ArrowsRightLeftIcon v-else class="w-4 h-4" />
                      {{ label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- NFT Grid -->
          <BaseLocalLoading 
          :active="isLoading"
          message="Loading NFTs..."
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <NFTCard 
              v-for="(nft, index) in nfts" 
              :key="nft.id" 
              :nft="nft"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 100}ms` }"
            />
            
          </div>
        </BaseLocalLoading>
          <BasePagination
            v-model:currentPage="currentPage"
            :pageSize="pageSize"
            :total="total"
          />
        </div>
      </div>
      
    </div>
  </main>
</template>

<script setup>
import { ref, watch,inject, getCurrentInstance, onMounted,onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
import { 
  ChevronDownIcon,
  ArrowsUpDownIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  Squares2X2Icon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
const walletStore = useWalletStore()
import { useNftStore } from '../stores/nft'
const nftStore = useNftStore()
const { nfts } = storeToRefs(nftStore)

const loading = inject('loading')
// 获取全局配置
const { proxy } = getCurrentInstance()
import BaseButton from '../components/BaseButton.vue'
import NFTCard from '../components/NFTCard.vue'
import GradientText from '../components/GradientText.vue'
import CreateNFTButton from '../components/CreateNFTButton.vue'
import BasePagination from '../components/BasePagination.vue'
import BaseLocalLoading from '../components/BaseLocalLoading.vue'

// Search, Sort and Filter states
const searchQuery = ref('')
const showSortDropdown = ref(false)
const showFilterDropdown = ref(false)
const selectedSort = ref('newest')
const selectedFilter = ref('All')

const sortOptions = {
  newest: 'Newest',
  oldest: 'Oldest'
}

const filterOptions = {
  All: 'All',
  Mint: 'Mint',
  Swap: 'Swap'
}

const isLoading = ref(true)
const currentPage = ref(1)
const pageSize = ref(16)
const total = ref(16)

const intervalId = ref(null)

// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  refreshNFTs(newPage)
})

// Toggle dropdown visibility
const toggleSort = () => {
  showSortDropdown.value = !showSortDropdown.value
  showFilterDropdown.value = false
}

const toggleFilter = () => {
  showFilterDropdown.value = !showFilterDropdown.value
  showSortDropdown.value = false
}

// Select options
const selectSort = (value) => {
  selectedSort.value = value
  showSortDropdown.value = false
  refreshNFTs()
}

const selectFilter = (value) => {
  selectedFilter.value = value
  showFilterDropdown.value = false
  refreshNFTs()
}

// Close dropdowns when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showSortDropdown.value = false
    showFilterDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  initData()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  clearInterval(intervalId.value);
})

const refreshNFTs = async () => {
  // proxy.$toast.show('message', 'success')
  // proxy.$toast.show('message', 'error')
  // proxy.$toast.show('message', 'warning')
  // proxy.$toast.show('message', 'info')
  
  // loading.show('Loading NFTs...')
  isLoading.value = true
  // 调用API获取NFT列表时传入排序和筛选参数
  // console.log('getNFTs:',{
  //   keyword: searchQuery.value,
  //   orderBy: selectedSort.value === 'newest' ? 'DESC' : 'ASC',
  //   projectState: selectedFilter.value === 'All' ? '' : selectedFilter.value
  // })
  await nftStore.getNFTs({
    keyword: searchQuery.value,
    orderBy: selectedSort.value === 'newest' ? 'DESC' : 'ASC',
    projectState: selectedFilter.value === 'All' ? '' : selectedFilter.value
  })
  // loading.hide()
  isLoading.value = false
}

const initData = () => {
  refreshNFTs()
  intervalId.value = setInterval(() => {
    nftStore.getNFTs({
    keyword: searchQuery.value,
    orderBy: selectedSort.value === 'newest' ? 'DESC' : 'ASC',
    projectState: selectedFilter.value === 'All' ? '' : selectedFilter.value
  })
  }, 5000);//5秒执行一次
}

// Handle search on enter
const handleSearch = () => {
  refreshNFTs()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  refreshNFTs()
}
</script>