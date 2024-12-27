<template>
  <div class="lg:grid lg:grid-cols-2 lg:gap-8">
    <!-- NFT Image -->
    <div class="relative">
      <div class="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=1&backgroundColor=b6e3f4" :alt="nft.name" class="w-full h-full object-cover">
      </div>
    </div>

    <!-- NFT Info -->
    <div class="mt-10 lg:mt-0">
      <h1 class="text-3xl font-bold text-white">{{ nft.name }}</h1>
      
      <div class="mt-6">
        <div class="flex items-center space-x-2">
          <span class="text-gray-400">Created by</span>
          <span class="text-white font-medium">{{ nft.creator }}</span>
        </div>
      </div>

      <!-- Mint Progress -->
      <div class="mt-8 space-y-4">
        <div class="flex justify-between items-center">
          <h3 class="text-xl font-semibold text-white">Mint Progress</h3>
          <span class="text-green-400">{{ mintProgress }}%</span>
        </div>
        <div class="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-300"
            :style="{ width: `${mintProgress}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-sm text-gray-400">
          <span>{{ nft.mintedSupply }} / {{ nft.totalSupply }} Minted</span>
          <span>Target: {{ nft.mintPercent }}%</span>
        </div>
      </div>

      <!-- Trade Interface -->
      <div class="mt-8 space-y-6">
        <template v-if="isMintPhase">
          <!-- Mint Interface -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Number of NFTs to Mint
            </label>
            <div class="relative">
              <input
                type="number"
                v-model="amount"
                class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter amount to mint"
                :min="1"
                :max="remainingSupply"
              />
              <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                <button 
                  v-for="preset in [1, 5, 10, 20]" 
                  :key="preset"
                  @click="amount = preset"
                  class="px-2 py-1 text-sm rounded bg-gray-800 text-gray-400 hover:text-green-400 transition-colors"
                >
                  {{ preset }}
                </button>
              </div>
            </div>
          </div>

          <!-- Price Summary -->
          <div class="space-y-3 border-t border-gray-800 pt-4">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Price per NFT</span>
              <span class="text-white">{{ nft.mintPrice }} NULS</span>
            </div>
            <div class="flex justify-between text-sm font-medium">
              <span class="text-gray-400">Total</span>
              <span class="text-green-400">{{ totalMintAmount }} NULS</span>
            </div>
          </div>

          <BaseButton 
            primary 
            class="w-full"
            @click="handleMint"
            :disabled="!canMint"
          >
            Mint Now
          </BaseButton>

          <p class="text-sm text-gray-400 text-center">
            Mint phase will end at {{ nft.mintPercent }}% ({{ remainingSupply }} NFTs remaining)
          </p>
        </template>

        <template v-else>
          <!-- Swap Interface -->
          <div class="space-y-6">
            <!-- Trade Type Selector -->
            <div class="flex space-x-2">
              <button 
                v-for="type in ['buy', 'sell']" 
                :key="type"
                @click="tradeType = type"
                class="flex-1 py-3 rounded-lg text-center font-medium transition-all"
                :class="[
                  tradeType === type 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-300'
                ]"
              >
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
              </button>
            </div>

            <!-- Amount Input -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                Amount to {{ tradeType }}
              </label>
              <div class="relative">
                <input
                  type="number"
                  v-model="amount"
                  class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :placeholder="`Enter amount to ${tradeType}`"
                  min="1"
                />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                  <button 
                    v-for="preset in [1, 5, 10, 20]" 
                    :key="preset"
                    @click="amount = preset"
                    class="px-2 py-1 text-sm rounded bg-gray-800 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {{ preset }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="space-y-3 border-t border-gray-800 pt-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Price per NFT</span>
                <span class="text-white">{{ nft.price }} NULS</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">
                  {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Fee ({{ getFeePercentage }}%)
                </span>
                <span class="text-white">{{ calculateFee }} NULS</span>
              </div>
              <div class="flex justify-between text-sm font-medium">
                <span class="text-gray-400">Total</span>
                <span class="text-green-400">{{ totalSwapAmount }} NULS</span>
              </div>
            </div>

            <BaseButton 
              primary 
              class="w-full"
              @click="handleSwap"
              :disabled="!canSwap"
            >
              {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Now
            </BaseButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BaseButton from '../BaseButton.vue'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})

const amount = ref('')
const tradeType = ref('buy')

// Computed Properties
const mintProgress = computed(() => {
  return ((props.nft.mintedSupply / props.nft.totalSupply) * 100).toFixed(2)
})

const isMintPhase = computed(() => {
  return Number(mintProgress.value) < 100
})

const remainingSupply = computed(() => {
  return props.nft.totalSupply - props.nft.mintedSupply
})

const getFeePercentage = computed(() => {
  return tradeType.value === 'buy' ? props.nft.buyFee : props.nft.sellFee
})

const calculateFee = computed(() => {
  if (!amount.value) return 0
  const baseAmount = Number(amount.value) * props.nft.price
  return ((baseAmount * getFeePercentage.value) / 100).toFixed(2)
})

const totalMintAmount = computed(() => {
  if (!amount.value) return 0
  return (Number(amount.value) * props.nft.mintPrice).toFixed(2)
})

const totalSwapAmount = computed(() => {
  if (!amount.value) return 0
  const baseAmount = Number(amount.value) * props.nft.price
  const fee = Number(calculateFee.value)
  return (baseAmount + fee).toFixed(2)
})

const canMint = computed(() => {
  if (!amount.value || Number(amount.value) <= 0) return false
  return Number(amount.value) <= remainingSupply.value
})

const canSwap = computed(() => {
  return amount.value && Number(amount.value) > 0
})

// Methods
const handleMint = async () => {
  try {
    console.log('Minting:', {
      amount: amount.value,
      totalCost: totalMintAmount.value
    })
  } catch (error) {
    console.error('Mint error:', error)
  }
}

const handleSwap = async () => {
  try {
    console.log(`${tradeType.value}ing:`, {
      amount: amount.value,
      totalCost: totalSwapAmount.value,
      fee: calculateFee.value
    })
  } catch (error) {
    console.error('Swap error:', error)
  }
}
</script>