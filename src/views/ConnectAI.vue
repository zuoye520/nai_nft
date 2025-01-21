<template>
    <div class="min-h-screen py-12 bg-black">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center space-y-8">
          <!-- Animated Icon -->
          <div class="relative w-24 h-24 mx-auto">
            <!-- Pulse Effect -->
            <div class="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse-slow blur-xl"></div>
            
            <!-- AI Brain Icon -->
            <div class="relative bg-gray-900/50 rounded-full p-6 border border-gray-800">
              <svg 
                class="w-full h-full text-green-400"
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="1.5"
              >
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                />
              </svg>
            </div>
          </div>
  
          <!-- Title with Gradient -->
          <h1 class="text-5xl font-bold mb-6">
            <GradientText>Connect AI</GradientText>
          </h1>
  
          <!-- Description with Animation -->
          <div class="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <p class="text-xl text-gray-400">
              Experience the Future of NFTs Through Our Advanced AI Integration
            </p>
            <p class="text-green-400 font-medium text-2xl">Coming Soon</p>
          </div>
  
          <!-- Animated Features Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div 
              v-for="(feature, index) in features" 
              :key="index"
              class="bg-gray-900/50 rounded-xl p-6 border border-gray-800 transform hover:scale-105 transition-all duration-300"
              :style="{ animationDelay: `${index * 100}ms` }"
            >
              <div class="w-12 h-12 mx-auto mb-4 bg-green-500/20 rounded-lg p-2">
                <component 
                  :is="feature.icon" 
                  class="w-full h-full text-green-400"
                />
              </div>
              <h3 class="text-white font-medium mb-2">{{ feature.title }}</h3>
              <p class="text-gray-400 text-sm">{{ feature.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { 
    SparklesIcon, 
    UserGroupIcon, 
    CpuChipIcon 
  } from '@heroicons/vue/24/outline'
  import GradientText from '../components/GradientText.vue'
  
  const features = [
    {
      icon: SparklesIcon,
      title: 'IP NFT',
      description: 'AI Creates Amazing IP NFTs for You'
    },
    {
      icon: UserGroupIcon,
      title: 'Operations Assistant',
      description: 'AI Agent Becomes Your Operations Assistant'
    },
    {
      icon: CpuChipIcon,
      title: 'AI Works for You',
      description: 'Let AI Be Your Powerful Assistant'
    }
  ]
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 1s ease-out forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>