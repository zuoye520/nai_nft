<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-6">Refer Friends</h1>
        <p class="text-xl text-gray-400">
          Earn rewards when your friends mint or trade NFTs
        </p>
      </div>

      <!-- Referral Link Card -->
      <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800 mb-12">
        <h2 class="text-xl font-semibold text-white mb-4">Your Referral Link</h2>
        <div class="flex items-center space-x-2">
          <input
            type="text"
            :value="referStore.referralLink"
            readonly
            class="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white"
          />
          <button
            @click="referStore.copyReferralLink"
            class="px-4 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            <DocumentDuplicateIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Referral Stats -->
      <div class="grid grid-cols-2 gap-6 mb-12">
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <div class="text-gray-400 mb-2">Total Referrals</div>
          <div class="text-2xl font-bold text-white">{{ referStore.stats.totalReferrals }}</div>
        </div>
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <div class="text-gray-400 mb-2">Total Earnings</div>
          <div class="text-2xl font-bold text-green-400">{{ referStore.stats.totalEarnings }} NULS</div>
        </div>
      </div>

      <!-- Referral History -->
      <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <h2 class="text-xl font-semibold text-white mb-6">Referral History</h2>
        <BaseLocalLoading 
          :active="isLoading"
          message="Loading data..."
        >
          <div class="space-y-4">
            <div v-for="(referral, index) in referStore.referralHistory" :key="index" 
              class="flex justify-between items-start py-4 border-b border-gray-800 last:border-0">
              <div>
                <div class="text-white mb-1">{{ referral.user }}</div>
                <div class="text-sm text-gray-400">{{ referral.date }}</div>
              </div>
              <div class="text-green-400 font-medium">
                +{{ referral.reward }} NULS
              </div>
            </div>
            <div v-if="referStore.referralHistory.length === 0" class="text-center py-12">
              <div class="text-gray-400">No Data Found</div>
            </div>
          </div>
        </BaseLocalLoading>
        <BasePagination
          v-model:currentPage="currentPage"
          :pageSize="pageSize"
          :total="referStore.referralHistoryTotal"
        />
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, watch, onMounted,onBeforeMount,getCurrentInstance } from 'vue'
import BasePagination from '../components/BasePagination.vue'
import BaseLocalLoading from '../components/BaseLocalLoading.vue'
import { DocumentDuplicateIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
const route = useRoute()
const { proxy } = getCurrentInstance();
import { useWalletStore } from '../stores/wallet'
const store = useWalletStore()
import { useReferStore } from '../stores/refer'
const referStore = useReferStore()

const origin = ref(window.location.origin);
const address = ref('')
const isLoading = ref(true)

const currentPage = ref(1)
const pageSize = ref(10)
// const total = ref(10)

onBeforeMount(() => {
  console.log('Component will be mounted')
})
onMounted(() => {
  address.value = route.params.address
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  referStore.referralLink = `${origin.value}?inviteCode=${userInfo.inviteCode}`
  referStore.stats = {
    totalReferrals:userInfo.inviteCount || 0,//邀请数量
    totalEarnings:userInfo.inviteReward || 0 //获得的奖励
  } 
  initData()
})
// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  initData(newPage)
})
const initData = async ()=>{
  isLoading.value = true;
  await referStore.getHistoryRefers({
    address:address.value,
    pageNum:1,
    pageSize:20
  })
  isLoading.value = false;
}

</script>