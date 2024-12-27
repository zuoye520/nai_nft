<template>
  <button
    @click="$router.push('/create')"
    class="relative group"
  >
    <!-- Animated Background Gradient -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#00ff87] via-[#60efff] to-[#00ff87] rounded-xl opacity-75 group-hover:opacity-100 blur-xl transition-all duration-500 animate-gradient-shift"></div>
    
    <!-- Main Button Container -->
    <div class="relative px-8 py-3 bg-black/80 backdrop-blur-sm rounded-xl flex items-center gap-3 overflow-hidden">
      <!-- Animated Border -->
      <div class="absolute inset-px rounded-xl bg-gradient-to-r from-[#00ff87] via-[#60efff] to-[#00ff87] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Moving Light Effect -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 transition-transform duration-1000 ease-out"></div>
      </div>

      <!-- Content Container -->
      <div class="relative flex items-center gap-3 z-10">
        <!-- Animated Icon -->
        <div class="relative">
          <div class="absolute inset-0 bg-gradient-to-r from-[#00ff87] to-[#60efff] rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 scale-[2] animate-pulse"></div>
          <div class="relative transform group-hover:rotate-90 transition-transform duration-500">
            <PlusIcon class="w-5 h-5 text-[#00ff87] group-hover:text-white transition-colors duration-500" />
          </div>
        </div>

        <!-- Animated Text -->
        <span class="relative font-bold text-lg tracking-wider">
          <span class="absolute inset-0 bg-gradient-to-r from-[#00ff87] to-[#60efff] blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
          <span class="relative text-transparent bg-clip-text bg-gradient-to-r from-[#00ff87] to-[#60efff] group-hover:text-white transition-all duration-500">
            Create NFT
          </span>
        </span>
      </div>

      <!-- Floating Particles -->
      <div class="absolute inset-0 pointer-events-none">
        <div v-for="n in 6" :key="n" class="particle-enhanced absolute w-1 h-1 rounded-full" :style="particleStyles[n-1]"></div>
      </div>
    </div>
  </button>
</template>

<script setup>
import { PlusIcon } from '@heroicons/vue/24/outline'

const particleStyles = [
  { background: '#00ff87', top: '20%', left: '10%' },
  { background: '#60efff', top: '60%', right: '10%' },
  { background: '#00ff87', bottom: '20%', left: '30%' },
  { background: '#60efff', top: '30%', right: '20%' },
  { background: '#00ff87', bottom: '40%', right: '30%' },
  { background: '#60efff', top: '50%', left: '20%' }
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
  background: radial-gradient(circle at center, rgba(0,255,135,0.1) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.7; }
}
</style>