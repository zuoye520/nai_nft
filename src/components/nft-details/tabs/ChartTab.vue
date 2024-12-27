<template>
  <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold text-white">Price Chart</h3>
        <p class="text-sm text-gray-400">Last 7 days trading history</p>
      </div>
      <div class="flex space-x-2">
        <button 
          v-for="period in periods" 
          :key="period"
          @click="selectedPeriod = period"
          class="px-3 py-1 rounded-lg text-sm"
          :class="[
            selectedPeriod === period
              ? 'bg-green-500/20 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <div class="h-96 flex items-center justify-center text-gray-400">
      Chart component will be implemented here
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  nft: {
    type: Object,
    required: true
  }
})

const periods = ['24H', '7D', '30D', 'ALL']
const selectedPeriod = ref('7D')
</script>