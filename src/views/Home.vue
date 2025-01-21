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
            <GradientText type="primary" class="ml-2">LIQUIDITY PROTOCOL COMBINED WITH AI AGENT</GradientText>
          </div>
          <p class="mt-8 text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in animation-delay-400">
            Trade, earn and manage NFT liquidity with our revolutionary protocol
          </p>
          
          <div class="mt-10 flex flex-col sm:flex-row justify-center gap-4 animate-fade-in animation-delay-600">
            <CreateNFTButton />
            <button
              class="relative group"
              @click="$router.push('/connect-ai')"
            >
              <!-- Animated Background Gradient -->
              <div class="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 rounded-xl opacity-75 group-hover:opacity-100 blur-xl transition-all duration-500 animate-gradient-shift"></div>
              
              <!-- Main Button Container -->
              <div class="relative px-8 py-3 bg-black/80 backdrop-blur-sm rounded-xl flex items-center gap-3 overflow-hidden">
                <!-- Animated Border -->
                <div class="absolute inset-px rounded-xl bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <!-- Moving Light Effect -->
                <div class="absolute inset-0">
                  <div class="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-1000 ease-out"></div>
                </div>

                <!-- Content Container -->
                <div class="relative flex items-center gap-3 z-10">
                  <!-- Animated Icon -->
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2] animate-pulse"></div>
                    <div class="relative transform group-hover:rotate-180 transition-transform duration-500">
                      <CpuChipIcon class="w-5 h-5 text-purple-400 group-hover:text-white transition-colors duration-500" />
                    </div>
                  </div>

                  <!-- Animated Text -->
                  <span class="relative font-bold text-lg tracking-wider">
                    <span class="absolute inset-0 bg-gradient-to-r from-purple-500 to-green-500 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                    <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-green-400 group-hover:text-white transition-all duration-500">
                      Connect AI
                    </span>
                  </span>
                </div>

                <!-- Floating Particles -->
                <div class="absolute inset-0 pointer-events-none">
                  <div v-for="n in 6" :key="n" class="particle-enhanced absolute w-1 h-1 rounded-full" :style="particleStyles[n-1]"></div>
                </div>
              </div>
            </button>
          </div>
          <div class="mt-10 flex justify-center">
            <router-link 
              to="/how-it-works"
              class="relative group text-gray-400 hover:text-white transition-colors duration-300"
            >
              <!-- Animated Underline -->
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 group-hover:w-full transition-all duration-300"></span>
              
              <!-- Text with Glow Effect -->
              <span class="relative">
                How it works?
                <!-- Glow Effect -->
                <span class="absolute inset-0 bg-gradient-to-r from-green-400/0 via-blue-500/10 to-purple-500/0 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </span>
            </router-link>
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
          <div v-if="nfts.length === 0" class="text-center py-12">
            <div class="text-gray-400">No NFTs</div>
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
  XMarkIcon,
  CpuChipIcon
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

const particleStyles = [
  { background: '#9333ea', top: '20%', left: '10%' },
  { background: '#3b82f6', top: '60%', right: '10%' },
  { background: '#22c55e', bottom: '20%', left: '30%' },
  { background: '#9333ea', top: '30%', right: '20%' },
  { background: '#3b82f6', bottom: '40%', right: '30%' },
  { background: '#22c55e', top: '50%', left: '20%' }
]

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
  isLoading.value = true
  await nftStore.getNFTs({
    keyword: searchQuery.value,
    orderBy: selectedSort.value === 'newest' ? 'DESC' : 'ASC',
    projectState: selectedFilter.value === 'All' ? '' : selectedFilter.value
  })
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

<style scoped>
.particle-enhanced {
  opacity: 0;
  transform: scale(0) rotate(0deg);
  transition: all 0.5s ease;
}

.group:hover .particle-enhanced {
  animation: particle-float 2s ease-in-out infinite;
  opacity: 0.6;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1) rotate(0deg);
  }
  50% {
    transform: translateY(-10px) scale(1.5) rotate(180deg);
  }
}

/* Stagger particle animations */
.particle-enhanced:nth-child(1) { animation-delay: 0s; }
.particle-enhanced:nth-child(2) { animation-delay: 0.2s; }
.particle-enhanced:nth-child(3) { animation-delay: 0.4s; }
.particle-enhanced:nth-child(4) { animation-delay: 0.6s; }
.particle-enhanced:nth-child(5) { animation-delay: 0.8s; }
.particle-enhanced:nth-child(6) { animation-delay: 1s; }

/* Add backdrop blur on hover */
.group:hover::after {
  content: '';
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle at center, rgba(147,51,234,0.1) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.7; }
}

.group:hover .glow {
  opacity: 1;
  transform: scale(1.5);
}
</style>