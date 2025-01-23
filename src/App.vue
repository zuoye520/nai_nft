<template>
  <div class="min-h-screen text-white">
    <!-- Global Loading -->
    <BaseLoading 
      v-if="isLoading"
      :message="loadingText"
      fullscreen
    />
    
    <!-- Global Toast -->
    <BaseToast ref="toastRef" />
    
    <AnimatedBackground />
    
    <nav class="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              <img src="/logo_white.png" alt="naiNFT" class="h-8">
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </nav>

    <div class="pt-16">
      <router-view v-slot="{ Component }">
        <transition 
          name="page" 
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <!-- Global Modal Layer -->
    <WalletModal />
    <WalletInstallModal 
      :show="walletStore.showWalletInstallModal"
      @close="walletStore.toggleWalletInstallModal"
    />
  </div>
</template>

<script setup>
import { ref, provide,onMounted } from 'vue'
import { setToastInstance } from './plugins/toast'
import BaseLoading from './components/BaseLoading.vue'
import BaseToast from './components/BaseToast.vue'
import ConnectWalletButton from './components/ConnectWalletButton.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import GradientText from './components/GradientText.vue'
import WalletModal from './components/wallet/WalletModal.vue'
import WalletInstallModal from './components/wallet/WalletInstallModal.vue'

import { useWalletStore } from './stores/wallet'
const walletStore = useWalletStore()

const urlParams = new URLSearchParams(window.location.search);
const inviteCode = ref(urlParams.get("inviteCode"));

// Loading state
const isLoading = ref(false)
const loadingText = ref('')

// Loading provider
provide('loading', {
  show: (text = 'Loading...') => {
    loadingText.value = text
    isLoading.value = true
  },
  hide: () => {
    isLoading.value = false
    loadingText.value = ''
  }
})

// Toast state and provider
// const toastRef = ref(null)

// provide('toast', {
//   show: (message, type = 'info') => {
//     toastRef.value?.addToast(message, type)
//   }
// })
// Toast setup
const toastRef = ref(null)
let intervalId = null;
onMounted(() => {
  // Set global toast instance
  setToastInstance(toastRef.value)
  //缓存邀请码
  localStorage.setItem('inviteCode',inviteCode.value)
  initData()
})
const initData = ()=>{
   walletStore.getNulsUsdPrice()
   walletStore.connect()

   intervalId = setInterval(() => {
    //NULS价格获取
    walletStore.getNulsUsdPrice()
  }, 10000);//10秒执行一次
}

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>