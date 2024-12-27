<template>
  <div class="min-h-screen text-white">
    <AnimatedBackground />
    
    <nav class="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-lg border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link to="/" class="flex-shrink-0 flex items-center">
              <GradientText type="primary" class="text-2xl">NAI NFT</GradientText>
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
  </div>
</template>

<script setup>
import ConnectWalletButton from './components/ConnectWalletButton.vue'
import AnimatedBackground from './components/AnimatedBackground.vue'
import GradientText from './components/GradientText.vue'
import WalletModal from './components/wallet/WalletModal.vue'
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