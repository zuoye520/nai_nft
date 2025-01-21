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
            <div class="text-white/80 mb-2">Total Rewards (Withdrawal fee: {{currentChainConfig.withdrawalFee}}%)</div>
            <div class="text-3xl font-bold text-white">{{ rewards }} NULS</div>
          </div>
          <button 
          v-if="store.account"
          :disabled="rewards <= 0"
            class="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            @click="handleWithdraw"
          >
            Withdraw
          </button>
        </div>
      </div>

      <!-- History Section -->
      <BaseLocalLoading 
          :active="isLoading"
          message="Loading data..."
        >
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h2 class="text-xl font-semibold text-white mb-6">History</h2>
          <div class="space-y-4">
            <div v-for="(reward, index) in rewardHistory" :key="index" 
              class="flex justify-between items-center py-4 border-b border-gray-800 last:border-0">
              <div>
                <div class="text-white">{{ reward.type }} </div>
                <div class="text-sm text-gray-400">{{ $format.formatDate(reward.date) }}</div>
              </div>
              <div :class="[
                'font-medium',
                reward.type != 'Withdrawal' ? 'text-green-400' : 'text-red-400'
              ]">
                {{ reward.luckyBonus }} NULS
              </div>
            </div>
          </div>
          <div v-if="rewardHistory.length === 0" class="text-center py-12">
            <div class="text-gray-400">No Data</div>
          </div>
        </div>
        
      </BaseLocalLoading>
      <BasePagination
        v-model:currentPage="currentPage"
        :pageSize="pageSize"
        :total="rewardHistoryTotal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,watch, onMounted,onBeforeMount,getCurrentInstance } from 'vue'
import BasePagination from '../components/BasePagination.vue'
import BaseLocalLoading from '../components/BaseLocalLoading.vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const route = useRoute()
const { proxy } = getCurrentInstance();
import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()
const { account, currentChainConfig } = storeToRefs(store)

import { useRewardsStore } from '../stores/rewards'
const rewardsStore = useRewardsStore()
const { rewards,rewardHistory,rewardHistoryTotal } = storeToRefs(rewardsStore)

const isLoading = ref(true)

const currentPage = ref(1)
const pageSize = ref(10)
// const total = ref(10)

// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  initData(newPage)
})

const address = ref('')
onBeforeMount(() => {
  console.log('Component will be mounted')
})
onMounted(() => {
  address.value = route.params.address
  initData()
})
const initData = async ()=>{
  isLoading.value = true
  await rewardsStore.getRewards(address.value)
  await rewardsStore.getHistoryRewards({
    address:address.value,
    pageNum:currentPage.value,
    pageSize:pageSize.value
  })
  isLoading.value = false
}
const handleWithdraw = async () => {
  try {
    await rewardsStore.receiveTiger()
    // console.log('Withdrawing rewards')
    proxy.$toast.show('Withdrawing rewards', 'success')
  } catch (error) {
    proxy.$toast.show(error, 'error')
  }
  
  initData()
}
</script>