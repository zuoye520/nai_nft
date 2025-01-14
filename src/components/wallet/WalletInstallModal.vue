<template>
    <Teleport to="body">
      <div v-if="show" class="fixed inset-0 z-[100]">
        <!-- Backdrop -->
        <div 
          class="absolute inset-0 bg-black/80 backdrop-blur-sm"
          @click="$emit('close')"
        ></div>
  
        <!-- Modal -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md">
          <div class="bg-[#1A1B1E] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="p-6 border-b border-gray-800">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-semibold text-white">Install NABOX Wallet</h3>
                <button 
                  @click="$emit('close')"
                  class="text-gray-400 hover:text-white transition-colors"
                >
                  <XMarkIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
  
            <!-- Content -->
            <div class="p-6 space-y-6">
              <div class="flex items-center justify-center">
                <!-- <img 
                  src="/nabox-logo.png" 
                  alt="NABOX Wallet" 
                  class="w-24 h-24 rounded-xl"
                /> -->
              </div>
  
              <p class="text-gray-300 text-center">
                To use this feature, you need to install NABOX Wallet first.
              </p>
  
              <div class="flex justify-center">
                <a 
                  :href="proxy.$config.NABOX_DOWNLOAD_URL"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-white font-medium hover:from-green-600 hover:to-blue-600 transition-all"
                >
                  <ArrowDownTrayIcon class="w-5 h-5" />
                  <span>Download NABOX Wallet</span>
                </a>
              </div>
            </div>
  
            <!-- Footer -->
            <div class="bg-gray-900/50 px-6 py-4">
              <p class="text-sm text-gray-400 text-center">
                After installation, please refresh the page
              </p>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </template>
  
  <script setup>
  import { getCurrentInstance } from 'vue'
  const { proxy } = getCurrentInstance()
  import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'
  
  defineProps({
    show: {
      type: Boolean,
      default: false
    }
  })
  
  defineEmits(['close'])
  </script>