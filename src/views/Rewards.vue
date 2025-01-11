<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-6">Rewards</h1>
        <p class="text-xl text-gray-400">
          Win lucky prizes by Mint/Swap NFT
        </p>
      </div>

      <!-- Reward Balance Card -->
      <div class="bg-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 mb-12">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-white/80 mb-2">Total Rewards</div>
            <div class="text-3xl font-bold text-white">{{ rewards }} NULS</div>
          </div>
          <button 
          v-if="store.account"
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
              <div class="text-sm text-gray-400">{{ $format.formatDate(reward.date) }}</div>
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
import { ref, onMounted,onBeforeMount,getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const route = useRoute()
const { proxy } = getCurrentInstance();
import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()

import { useRewardsStore } from '../stores/rewards'
const rewardsStore = useRewardsStore()
const { rewards,rewardHistory } = storeToRefs(rewardsStore)

const address = ref('')
onBeforeMount(() => {
  console.log('Component will be mounted')
})
onMounted(() => {
  address.value = route.params.address
  initData()
})
const initData = ()=>{
  rewardsStore.getRewards(address.value)
  rewardsStore.getHistoryRewards({
    address:address.value
  })
}

const handleWithdraw = async () => {
  await rewardsStore.receiveTiger()
  console.log('Withdrawing rewards')
}
</script>