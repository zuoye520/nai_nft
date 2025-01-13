<template>
  <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
    <div class="space-y-6">
      <BaseLocalLoading :active="isLoading" message="Loading data...">
        <!-- 你的内容 -->
        <div
          v-for="tx in nftStore.transactions"
          :key="tx.hash"
          class="flex items-center justify-between py-4 border-b border-gray-800 last:border-0"
        >
          <!-- Transaction Type and User Info -->
          <div class="flex items-center space-x-4">
            <div class="p-2 rounded-lg" :class="getTypeStyles(tx.type)">
              <component :is="getTypeIcon(tx.type)" class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center space-x-2">
                <span class="text-white font-medium">{{
                  tx.type == "CreateToken" ? "Create" : tx.type
                }}</span>
                <span class="text-gray-400">by</span>
                <button
                  @click="store.openExplorerHash(tx.txHash)"
                  class="text-blue-400"
                  >{{ $format.shortenAddress(tx.from) }}
                  </button>
              </div>
              <div class="flex items-center space-x-2 text-sm">
                <span class="text-gray-400">{{
                  $format.formatDate(tx.timestamp)
                }}</span>
                <!-- Lucky Bonus Badge -->
                <div
                  v-if="tx.luckyBonus"
                  class="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full"
                >
                  <SparklesIcon class="w-4 h-4" />
                  <span>Win {{ tx.luckyBonus }} NULS Lucky Bonus!</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Amount Info -->
          <div class="text-right">
            <div class="text-white font-medium">{{ tx.amount }} NULS</div>
            <!-- <div class="text-sm text-gray-400">≈ ${{ tx.usdValue }}</div> -->
            <div v-show="tx.nftCount" class="text-sm text-gray-400">
              {{ tx.nftCount }} NFT
            </div>
          </div>
        </div>
        <!-- Empty State -->
        <div v-if="nftStore.transactions.length === 0" class="text-center py-8">
          <div class="text-gray-400">No transactions yet</div>
        </div>
      </BaseLocalLoading>
      <BasePagination
        v-model:currentPage="currentPage"
        :pageSize="pageSize"
        :total="nftStore.transactionsTotal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref,watch } from 'vue'
import { useWalletStore } from '../../../stores/wallet'
const store = useWalletStore()
import { useNftStore } from '../../../stores/nft'
const nftStore = useNftStore()
import BaseLocalLoading from "../../../components/BaseLocalLoading.vue";
import BasePagination from '../../../components/BasePagination.vue'
import {
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
  SparklesIcon,
} from "@heroicons/vue/24/outline";

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  nft: {
    type: Object,
    required: true,
  },
});

// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  nftStore.getNftTxn({
    id:props.nft.id,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  })
})

const getTypeStyles = (type) => {
  const styles = {
    CreateToken: "bg-red-500/20 text-red-400",
    Mint: "bg-green-500/20 text-green-400",
    Buy: "bg-blue-500/20 text-blue-400",
    Sell: "bg-blue-500/20 text-red-400",
  };
  return styles[type];
};

const getTypeIcon = (type) => {
  const icons = {
    CreateToken: ArrowsUpDownIcon,
    Mint: ArrowDownIcon,
    Buy: ArrowsRightLeftIcon,
    Sell: ArrowsRightLeftIcon,
  };
  return icons[type];
};

const getTypeName = (type) => {
  const name = {
    CreateToken: 'Create',
    Mint: 'Mint',
    Swap: '',
  };
  return name[type];
};

// const shortenAddress = (address) => {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`
// }

// const formatDate = (timestamp) => {
//   return new Date(timestamp).toLocaleString()
// }
</script>
