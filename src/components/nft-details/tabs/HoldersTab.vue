<template>
  <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
    <h3 class="text-xl font-semibold text-white mb-6">Top 20 Holders</h3>
    
    <div class="space-y-4">
      <div v-for="(holder, index) in holders" :key="holder.address" 
        class="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
        <div class="flex items-center space-x-4">
          <div class="w-8 text-center text-gray-400">#{{ index + 1 }}</div>
          <img :src="holder.avatar" :alt="holder.address" class="w-8 h-8 rounded-full">
          <div>
            <div class="text-white font-medium">{{ shortenAddress(holder.address) }}</div>
            <div class="text-sm text-gray-400">Joined {{ formatDate(holder.joinDate) }}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-white font-medium">{{ holder.balance }} NFTs</div>
          <div class="text-sm text-gray-400">{{ holder.percentage }}%</div>
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
  },
  holders: {
    type: Array,
    required: true
  },
})

const shortenAddress = (address) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString()
}

</script>