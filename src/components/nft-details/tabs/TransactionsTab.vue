<template>
  <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
    <div class="space-y-6">
      <div v-for="tx in transactions" :key="tx.hash" class="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
        <!-- Transaction Type and User Info -->
        <div class="flex items-center space-x-4">
          <div class="p-2 rounded-lg" :class="getTypeStyles(tx.type)">
            <component :is="getTypeIcon(tx.type)" class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-white font-medium">{{ tx.type }}</span>
              <span class="text-gray-400">by</span>
              <span class="text-blue-400">{{ shortenAddress(tx.from) }}</span>
            </div>
            <div class="flex items-center space-x-2 text-sm">
              <span class="text-gray-400">{{ formatDate(tx.timestamp) }}</span>
              <!-- Lucky Bonus Badge -->
              <div v-if="tx.luckyBonus" class="flex items-center space-x-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-full">
                <SparklesIcon class="w-4 h-4" />
                <span>Win 1 NULS Lucky Bonus!</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Amount Info -->
        <div class="text-right">
          <div class="text-white font-medium">{{ tx.amount }} NULS</div>
          <div class="text-sm text-gray-400">≈ ${{ tx.usdValue }}</div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="transactions.length === 0" class="text-center py-8">
        <div class="text-gray-400">No transactions yet</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  ArrowDownIcon,
  ArrowsRightLeftIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})

// Mock transactions data - only Mint and Swap transactions
const transactions = [
  {
    hash: '0x123...',
    type: 'Mint',
    from: '0xabc...',
    amount: 100,
    usdValue: 150,
    timestamp: Date.now() - 3600000,
    luckyBonus: true
  },
  {
    hash: '0x456...',
    type: 'Swap',
    from: '0xdef...',
    amount: 120,
    usdValue: 180,
    timestamp: Date.now() - 7200000,
    luckyBonus: false
  },
  {
    hash: '0x789...',
    type: 'Mint',
    from: '0xghi...',
    amount: 50,
    usdValue: 75,
    timestamp: Date.now() - 10800000,
    luckyBonus: true
  },
  {
    hash: '0x101...',
    type: 'Swap',
    from: '0xjkl...',
    amount: 80,
    usdValue: 120,
    timestamp: Date.now() - 14400000,
    luckyBonus: true
  }
]

const getTypeStyles = (type) => {
  const styles = {
    'Mint': 'bg-green-500/20 text-green-400',
    'Swap': 'bg-blue-500/20 text-blue-400'
  }
  return styles[type]
}

const getTypeIcon = (type) => {
  const icons = {
    'Mint': ArrowDownIcon,
    'Swap': ArrowsRightLeftIcon
  }
  return icons[type]
}

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
</script>
