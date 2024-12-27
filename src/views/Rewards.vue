<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-6">Rewards</h1>
        <p class="text-xl text-gray-400">
          Earn rewards by minting NFTs and winning lucky bonus
        </p>
      </div>

      <!-- Reward Balance Card -->
      <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-12">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white/80 mb-2">Total Rewards</div>
            <div class="text-3xl font-bold text-white">{{ store.rewards }} NULS</div>
          </div>
          <button 
            class="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors"
            @click="handleWithdraw"
          >
            Withdraw
          </button>
        </div>
      </div>

      <!-- History Section -->
      <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-6">History</h2>
        <div class="space-y-4">
          <div v-for="(reward, index) in rewardHistory" :key="index" 
            class="flex justify-between items-center py-4 border-b border-gray-800 last:border-0">
            <div>
              <div class="text-white">{{ reward.type }}</div>
              <div class="text-sm text-gray-400">{{ reward.date }}</div>
            </div>
            <div :class="[
              'font-medium',
              reward.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
            ]">
              {{ reward.amount }} NULS
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWalletStore } from '../stores/wallet'

const store = useWalletStore()

const rewardHistory = ref([
  {
    type: 'Lucky Bonus',
    date: '2024.01.26 10:44:07',
    amount: '+0.00606'
  },
  {
    type: 'Mint Reward',
    date: '2024.01.25 14:55:14',
    amount: '+0.00369'
  },
  {
    type: 'Withdrawal',
    date: '2024.01.24 09:33:38',
    amount: '-0.65688'
  }
])

const handleWithdraw = () => {
  // Handle withdrawal logic
  console.log('Withdrawing rewards')
}
</script>