<template>
  <div class="relative">
    <!-- Not Connected State -->
    <button
      v-if="!store.isConnected"
      @click="store.connect"
      class="relative group"
    >
      <!-- Animated Background Gradient -->
      <div class="absolute inset-0 bg-gradient-to-r from-[#c6ff00] via-[#a2e838] to-[#c6ff00] rounded-xl opacity-75 group-hover:opacity-100 blur-xl transition-all duration-500 animate-gradient-shift"></div>
      
      <!-- Main Button Container -->
      <div class="relative px-8 py-3 bg-black/80 backdrop-blur-sm rounded-xl flex items-center gap-3 overflow-hidden">
        <!-- Animated Border -->
        <div class="absolute inset-px rounded-xl bg-gradient-to-r from-[#c6ff00] via-[#a2e838] to-[#c6ff00] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <!-- Moving Light Effect -->
        <div class="absolute inset-0">
          <div class="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-1000 ease-out"></div>
        </div>

        <!-- Content Container -->
        <div class="relative flex items-center gap-3 z-10">
          <!-- Animated Icon -->
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-r from-[#c6ff00] to-[#a2e838] rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2] animate-pulse"></div>
            <div class="relative transform group-hover:rotate-12 transition-transform duration-500">
              <WalletIcon class="w-5 h-5 text-[#c6ff00] group-hover:text-white transition-colors duration-500" />
            </div>
          </div>

          <!-- Animated Text -->
          <span class="relative font-bold text-lg tracking-wider">
            <span class="absolute inset-0 bg-gradient-to-r from-[#c6ff00] to-[#a2e838] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-[#c6ff00] to-[#a2e838] group-hover:text-white transition-all duration-500">
              Connect
            </span>
          </span>
        </div>

        <!-- Floating Particles -->
        <div class="absolute inset-0 pointer-events-none">
          <div v-for="n in 6" :key="n" class="particle-enhanced absolute w-1 h-1 rounded-full" :style="particleStyles[n-1]"></div>
        </div>
      </div>
    </button>

    <!-- Connected State -->
    <button 
      v-else
      @click="store.toggleWalletModal"
      class="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-900/50 border border-gray-800 hover:border-green-500/30 transition-all"
    >
      <img 
        :src="proxy.$config.DEFAULT_AVATAR" 
        class="w-8 h-8 rounded-full"
      />
      <span class="text-white">{{ store.shortAddress }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref,getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance();
import { storeToRefs } from 'pinia'
import { WalletIcon } from '@heroicons/vue/24/outline'
import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()

const particleStyles = [
  { background: '#c6ff00', top: '20%', left: '10%' },
  { background: '#a2e838', top: '60%', right: '10%' },
  { background: '#c6ff00', bottom: '20%', left: '30%' },
  { background: '#a2e838', top: '30%', right: '20%' },
  { background: '#c6ff00', bottom: '40%', right: '30%' },
  { background: '#a2e838', top: '50%', left: '20%' }
]
</script>

<style scoped>
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.animate-gradient-shift {
  animation: gradient-shift 3s ease infinite;
  background-size: 200% 200%;
}

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
  background: radial-gradient(circle at center, rgba(198, 255, 0, 0.1) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.7; }
}
</style>