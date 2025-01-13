<template>
  <div 
    class="group relative bg-[#1A1B1E] rounded-xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-1"
    @click="$router.push(`/nft/${nft.id}`)"
  >
    <!-- Animated Border Gradient -->
    <div class="absolute -inset-[1px] bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>

    <!-- Card Content Container -->
    <div class="relative bg-[#1A1B1E] rounded-xl p-4 z-10">
      <!-- NFT Image with Lazy Loading -->
      <div class="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
        <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500"></div>
        
        <!-- Loading Placeholder -->
        <div 
          v-show="!imageLoaded"
          class="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
        >
          <div class="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Lazy Loaded Image -->
        <img 
          :src="nft.image" 
          :alt="nft.name"
          class="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-500"
          loading="lazy"
          @load="onImageLoad"
          ref="imageRef"
        />
      </div>

      <!-- NFT Info -->
      <div class="space-y-3">
        <!-- Name -->
        <h3 class="text-lg font-semibold text-white group-hover:text-green-400 transition-colors duration-300">
          <div class="flex items-center justify-between">
            <span>{{ nft.name }} </span>
            <span v-show="tokenid" class="text-green-400 font-medium">#{{nft.tokenId}}</span>
          </div>
        </h3>
        <div v-show="!tokenid">
          <!-- Market Value -->
          <div  class="flex items-center justify-between">
            <span class="text-gray-400">Market cap:</span>
            <span class="text-green-400 font-medium">{{ nft.marketValue }} NULS</span>
          </div>

          <!-- Progress Bar -->
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Progress:</span>
              <span class="text-green-400">{{ mintProgress }}%</span>
            </div>
            <div class="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
                :style="{ width: `${mintProgress}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted,onBeforeUnmount } from 'vue'

const props = defineProps({
  nft: {
    type: Object,
    required: true,
    default: () => ({
      id: '',
      name: '',
      image: '',
      marketValue: 0,
      totalSupply: 1000,
      mintedSupply: 0,
      tokenId:''
    })
  },
  tokenid:{
    type: Boolean,
    default: false
  }
})

const imageRef = ref(null)
const imageLoaded = ref(false)
const observer = ref(null)

const mintProgress = computed(() => {
  return ((props.nft.mintedSupply / (props.nft.totalSupply * props.nft.mintPercent / 100)) * 100).toFixed(1)
})

const onImageLoad = () => {
  imageLoaded.value = true
}

onMounted(() => {
  // 创建 Intersection Observer
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 当图片进入视口时，设置 src
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          // 停止观察这个元素
          observer.value.unobserve(img)
        }
      }
    })
  }, {
    root: null,
    rootMargin: '50px', // 提前50px开始加载
    threshold: 0.1
  })

  // 开始观察图片元素
  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
})

onBeforeUnmount(() => {
  // 清理 observer
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>
