<template>
  <div class="lg:grid lg:grid-cols-2 lg:gap-8">
    <!-- NFT Image -->
    <div class="relative">
      <div class="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
        <img :src="nft.image" :alt="nft.name" class="w-full h-full object-cover">
      </div>
    </div>

    <!-- NFT Info -->
    <div class="mt-10 lg:mt-0">
      <h1 class="text-3xl font-bold text-white">{{ nft.name }}</h1>
      
      <div class="mt-6">
        <div class="flex items-center space-x-2">
          <span class="text-gray-400">Created by</span>
          <router-link :to="`/profile/${nft.creator}`" class="text-white font-medium">{{ $format.shortenAddress(nft.creator) }}</router-link>
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
          v-if="account"
            primary 
            class="w-full"
            @click="handleMint"
            :disabled="!canMint"
          >
            Mint Now
          </BaseButton>
          <BaseButton 
          v-else
            primary 
            class="w-full"
            @click="walletStore.connect"
          >
            Connect
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
                @click="tradeType = type;amount = ''"
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
                    @click="checkPrice(preset)" 
                    class="px-2 py-1 text-sm rounded bg-gray-800 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {{ preset }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Price Summary -->
            <div class="space-y-3 border-t border-gray-800 pt-4">
              <!-- <div class="flex justify-between text-sm">
                <span class="text-gray-400">Price per NFT</span>
                <span class="text-white">{{ nft.price }} NULS</span>
              </div> -->
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">
                  {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Fee 
                </span>
                <span class="text-white">{{ getFeePercentage }}%</span>
              </div>
              <div class="flex justify-between text-sm font-medium">
                <span class="text-gray-400">{{ tradeType === 'buy' ? 'Cost' : 'Get' }}</span>
                <span class="text-green-400">{{ totalSwapAmount }} NULS</span>
              </div>
            </div>

            <BaseButton 
              v-if="account"
              primary 
              class="w-full"
              @click="handleSwap"
              :disabled="!canSwap"
            >
              {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Now
            </BaseButton>
            <BaseButton 
              v-else
                primary 
                class="w-full"
                @click="walletStore.connect"
              >
                Connect
              </BaseButton>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,getCurrentInstance} from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../../stores/wallet'
const walletStore = useWalletStore()
import { useNftStore } from '../../stores/nft'
const nftStore = useNftStore()
const { account, currentChainConfig} = storeToRefs(walletStore)
const { proxy } = getCurrentInstance()
import BaseButton from '../BaseButton.vue'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})

const amount = ref('')
const tradeType = ref('buy')
const swapPrice = ref(0)
const totalSwapAmount = ref(0)

// Computed Properties
const mintProgress = computed(() => {
  return ((props.nft.mintedSupply / (props.nft.totalSupply * props.nft.mintPercent / 100)) * 100).toFixed(1)
})

const isMintPhase = computed(() => {
  return Number(mintProgress.value) < 100
})

const remainingSupply = computed(() => {
  return  (props.nft.totalSupply * props.nft.mintPercent / 100) - props.nft.mintedSupply
})

const getFeePercentage = computed(() => {
  return tradeType.value === 'buy' ? props.nft.buyFee : props.nft.sellFee
})

// const calculateFee = computed(() => {
//   if (!amount.value) return 0
//   const baseAmount = Number(amount.value) * props.nft.price
//   return ((baseAmount * getFeePercentage.value) / 100).toFixed(2)
// })

const totalMintAmount = computed(() => {
  if (!amount.value) return 0
  return (Number(amount.value) * props.nft.mintPrice).toFixed(2)
})

// const totalSwapAmount = computed(() => {
//   if (!amount.value) return 0
//   const baseAmount = Number(amount.value) * swapPrice.value
//   // const fee = Number(calculateFee.value)
//   return (baseAmount).toFixed(2)
// })

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
      pid:props.nft.pid,
      amount: amount.value,
      totalCost: totalMintAmount.value
    })
    const data = {
      from: account.value,
      value: totalMintAmount.value,//mint费用
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: "mint",
      args: [
        props.nft.pid,//pid    
        amount.value,//mint数据
      ]
    }
    console.log('mint data:',data)
    const result = await walletStore.contractCall(data)
    console.log('mint result:',result)

  } catch (error) {
    console.error('Mint error:', error)
  }
}
const checkPrice = async (preset)=>{
  amount.value = preset;
  const methodName = tradeType.value == "buy" ? "getBuyCost" : "getSellAmount" 
  const data = {
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: methodName,
      args: [
        props.nft.pid,//pid    
        amount.value,//数量
      ]
    }
  const result = await walletStore.invokeView(data)
  console.log('result:',result)
  totalSwapAmount.value =  proxy.$format.fromAmount(result.result)
}

const handleSwap = async () => {
  try {
    console.log(`${tradeType.value}ing:`, {
      amount: amount.value,
      totalCost: totalSwapAmount.value,
    })
    let data = {
      from: account.value,
      value: totalSwapAmount.value,//mint费用
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: "buyToken" ,//buyToken/sellToken
      args: [
        props.nft.pid,//pid    
        amount.value,//mint数据
      ]
    }
    if(tradeType.value == 'sell'){
      //获取持有的NFT
      const heldList = await nftStore.getHeldNFTs({
        address:account.value,
        nftId:props.nft.id,
        pageSize:amount.value
      })
      if(heldList.length < amount.value){
        console.log('nft 余额不足')
        return;
      }
      const nftIds = heldList.map((item)=>{
        return item.tokenId;
      })
      console.log('nftIds:',nftIds)
      data = {
        from: account.value,
        contractAddress: currentChainConfig.value.contracts.mainAddress,
        methodName: "sellToken" ,//buyToken/sellToken
        args: [
          props.nft.pid,//pid    
          nftIds,//nftIds
        ]
      }
    }
    console.log('swap data:',data)
    const result = await walletStore.contractCall(data)
    console.log('swap result:',result)
  } catch (error) {
    console.error('Swap error:', error)
  }
}
</script>