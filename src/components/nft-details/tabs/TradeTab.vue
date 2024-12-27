<template>
  <div class="space-y-6">
    <!-- Trading Stats -->
    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <div class="grid grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm text-gray-400 mb-2">24h Volume</h3>
          <p class="text-xl font-semibold text-white">{{ nft.volume }} NULS</p>
        </div>
        <div>
          <h3 class="text-sm text-gray-400 mb-2">Buy Fee</h3>
          <p class="text-xl font-semibold text-white">{{ nft.buyFee }}%</p>
        </div>
        <div>
          <h3 class="text-sm text-gray-400 mb-2">Sell Fee</h3>
          <p class="text-xl font-semibold text-white">{{ nft.sellFee }}%</p>
        </div>
      </div>
    </div>

    <!-- Recent Trades -->
    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <h3 class="text-xl font-semibold text-white mb-4">Recent Trades</h3>
      <div class="space-y-4">
        <div v-for="trade in recentTrades" :key="trade.id" class="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
          <div class="flex items-center space-x-3">
            <div :class="[
              'p-2 rounded-lg',
              trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            ]">
              {{ trade.type === 'buy' ? '↑' : '↓' }}
            </div>
            <div>
              <div class="text-white">{{ trade.amount }} NFTs</div>
              <div class="text-sm text-gray-400">{{ formatDate(trade.timestamp) }}</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-white">{{ trade.price }} NULS</div>
            <div class="text-sm text-gray-400">≈ ${{ trade.usdValue }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  nft: {
    type: Object,
    required: true
  }
})

// Mock recent trades data
const recentTrades = [
  {
    id: 1,
    type: 'buy',
    amount: 5,
    price: 500,
    usdValue: '750.00',
    timestamp: Date.now() - 300000
  },
  {
    id: 2,
    type: 'sell',
    amount: 3,
    price: 290,
    usdValue: '435.00',
    timestamp: Date.now() - 900000
  },
  {
    id: 3,
    type: 'buy',
    amount: 2,
    price: 200,
    usdValue: '300.00',
    timestamp: Date.now() - 3600000
  }
]

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}
</script>