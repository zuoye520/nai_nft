<template>
  <div class="lg:grid lg:grid-cols-2 lg:gap-8">
    <!-- NFT Image with Lazy Loading -->
    <div class="relative">
      <div class="aspect-w-1 aspect-h-1 rounded-xl overflow-hidden">
        <!-- Loading Placeholder -->
        <div 
          v-show="!imageLoaded"
          class="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center"
        >
          <div class="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <!-- Background Blur Effect -->
        <div 
          class="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 
                 filter blur-xl opacity-0 transition-opacity duration-700"
          :class="{ 'opacity-30': imageLoaded }"
        ></div>

        <!-- Lazy Loaded Image -->
        <img 
          :src="nft.image" 
          :alt="nft.name"
          class="w-full h-full object-cover transition-all duration-700"
          :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
          loading="lazy"
          @load="onImageLoad"
          ref="imageRef"
        >
      </div>
    </div>

    <!-- NFT Info -->
    <div class="mt-10 lg:mt-0">
      <h1 class="text-3xl font-bold text-white">{{ nft.name }}</h1>
      <!-- <div>
        There are 100 NFTs in total, of which 80 NFTs are available for minting at a price of 1 NULS (75% of NFTs minted will receive a lucky reward). After all minting is completed, 20% of the raised NULS will automatically join the liquidity pool with the remaining 20 NFTs and start the NFT exchange mode. The initial market value is 71.415 NULS. Currently, there are 0 NFTs left for minting, and 328.44 NULS has been raised so far.
      </div> -->
      <div class="mt-6">
        <div class="flex items-center space-x-2">
          <span class="text-gray-400">Created by</span>
          <router-link :to="`/profile/${nft.creator}`" class="text-white font-medium">
            {{ $format.shortenAddress(nft.creator) }}
          </router-link>
        </div>
      </div>

      <!-- Progress Bar Section -->
      <div class="mt-8 space-y-4">
        <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <h3 class=" text-white">Mint Progress：<span class="text-green-400">{{ mintProgress }}%</span></h3>
          <!-- 添加提示图标和提示框 -->
          <div class="relative group">
            <InformationCircleIcon class="w-5 h-5 text-gray-400 hover:text-green-400 cursor-help" />
            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <div class="bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg p-3 text-sm text-gray-300">
                The total supply of NFT is divided into two parts, {{nft.mintPercent}}% is used for fair mint, and {{100-nft.mintPercent}}% is used to enter the liquidity pool for swap transactions,Mint NFTs to get lucky rewards.
                <div class="absolute left-1/2 -bottom-2 -translate-x-1/2 border-8 border-transparent border-t-gray-900/95"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="space-x-2" >
          <div class=" text-white">Pool：<span class="text-green-400">{{ poolSupplyToken }} NTFs - {{poolSupplyNuls}} NULS</span></div>
        </div>
        
      </div>

        <!-- Progress Bar Container -->
        <div class="relative">
          <!-- Progress Bar -->
          <div class="w-full h-4 bg-gray-800 rounded-full flex relative">
            <!-- Mint Phase (Fixed 70%) -->
            <div 
              class="progress-section relative h-full rounded-l-full"
              :style="{width: `${nft.mintPercent}%`}"
            >
              <!-- Mint Progress Fill -->
              <div class="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 overflow-hidden rounded-l-full">
                <div 
                  class="absolute inset-0 bg-gray-800 transition-all duration-300"
                  :style="{ left: `${mintProgress}%` }"
                ></div>
              </div>

              <!-- Mint Phase Tooltip -->
              <div class="progress-tooltip">
                <div class="tooltip-inner">
                  <div class="text-center mb-1 font-medium">Mint Phase</div>
                  <!-- <div class="flex justify-between text-gray-300">
                    <span>Progress:</span>
                    <span>{{ mintProgress }}%</span>
                  </div> -->
                  <div class="flex justify-between text-gray-300">
                    <span>Supply:</span>
                    <span>{{ targetMintSupply }} NFTs</span>
                  </div>
                  <div class="flex justify-between text-gray-300" v-if="targetMintSupply != nft.mintedSupply">
                    <span>Minted:</span>
                    <span>{{ nft.mintedSupply }} NFTs</span>
                  </div>
                  <div class="flex justify-between text-gray-300" v-if="targetMintSupply != nft.mintedSupply">
                    <span>Remaining:</span>
                    <span>{{ remainingSupply }} NFTs</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Swap Phase (Fixed 30%) -->
            <div 
              class="progress-section relative h-full rounded-r-full"
              :style="{width: `${100-nft.mintPercent}%`}"
            >
              <!-- Swap Progress Fill -->
              <div class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 overflow-hidden rounded-r-full">
                <div 
                  class="absolute inset-0 bg-gray-800 transition-all duration-300"
                  :style="{ left: `100%` }"
                ></div>
              </div>

              <!-- Swap Phase Tooltip -->
              <div class="progress-tooltip">
                <div class="tooltip-inner">
                  <div class="text-center mb-1 font-medium">Swap Phase</div>
                  <!-- <div class="flex justify-between text-gray-300">
                    <span>Liquidity Pool:</span>
                    <span>{{ swapPhaseProgress }}%</span>
                  </div> -->
                  <div class="flex justify-between text-gray-300">
                    <span>Supply:</span>
                    <span>{{ swapSupply }} NFTs</span>
                  </div>
                  <!-- <div class="flex justify-between text-gray-300">
                    <span>Initial Supply:</span>
                    <span>{{swapSupplyNuls}} NULS</span>
                  </div> -->
                </div>
              </div>
            </div>
          </div>

          <!-- Phase Labels -->
          <div class="absolute top-full left-0 right-0 flex mt-2" v-if="remainingSupply > 0">
            <!-- <div>There are 100 NFTs in total, of which 80 NFTs are available for minting at a price of 1 NULS (75% of NFTs minted will receive a lucky reward). After all minting is completed, 20% of the raised NULS will automatically join the liquidity pool with the remaining 20 NFTs and start the NFT exchange mode. The initial market value is 71.415 NULS. Currently, there are 0 NFTs left for minting, and 328.44 SOL has been raised so far.</div> -->
            <div style="width: 70%" class="text-left">
              <span class="text-sm text-gray-400">Mint Phase({{ nft.mintPercent }}%)</span>
            </div>
            <div class="flex-1 text-right">
              <span class="text-sm text-gray-400">Swap Phase({{ swapPhase }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Trade Interface -->
      <div class="mt-10 space-y-6">
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
                @input="validateAmountInput"
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
            <div v-if="account" class="flex justify-between text-sm font-medium">
              <span class="text-gray-400">Available Balance</span>
              <span class="text-green-400">{{$format.fromAmount( walletStore.nulsBalance) }} NULS</span>
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

          <!-- <p class="text-sm text-gray-400 text-center">
            Mint phase will end at {{ nft.mintPercent }}% ({{ remainingSupply }} NFTs remaining)
          </p> -->
        </template>

        <template v-else>
          <!-- Swap Interface -->
          <div class="space-y-6">
            <!-- Trade Type Selector -->
            <div class="flex space-x-2">
              <button 
                v-for="type in ['buy', 'sell']" 
                :key="type"
                @click="handelBuyAndSell(type)"
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
                  @input="validateAmountInput"
                  @blur="checkPrice(amount)"
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
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">
                  {{ tradeType === 'buy' ? 'Buy' : 'Sell' }} Fee 
                </span>
                <span class="text-white">{{ getFeePercentage }}%</span>
              </div>
              <div v-if="account" class="flex justify-between text-sm font-medium">
                <span class="text-gray-400">Available Balance</span>
                <span class="text-green-400">{{ tradeType === 'buy' ? `${$format.fromAmount( walletStore.nulsBalance)} NULS`: `${nftStore.listTotal} NFT`}} </span>
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
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../../stores/wallet'
import { useNftStore } from '../../stores/nft'
import BaseButton from '../BaseButton.vue'

const { proxy } = getCurrentInstance()
const walletStore = useWalletStore()
const nftStore = useNftStore()
const { account, currentChainConfig } = storeToRefs(walletStore)

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})

// Image lazy loading state
const imageRef = ref(null)
const imageLoaded = ref(false)
const observer = ref(null)

// Trading state
const amount = ref('')
const tradeType = ref('buy')
const swapPrice = ref(0)
const totalSwapAmount = ref(0)

const mintProgress = computed(() => {
  return ((props.nft.mintedSupply / (props.nft.totalSupply * props.nft.mintPercent / 100)) * 100).toFixed(1)
})

// Progress bar constants and computed properties

const targetMintSupply = computed(() => {
  return Math.floor(props.nft.totalSupply * props.nft.mintPercent / 100)
})

const swapSupply = computed(() => {
  return props.nft.totalSupply - targetMintSupply.value
})


const poolSupplyToken = computed(() => {
  if(props.nft.projectState == 'Mint'){
    return swapSupply
  }else{
    return props.nft.ammReverseToken - props.nft.threshold + ((props.nft.totalSupply * (100 - props.nft.mintPercent) / 100) - props.nft.bcReverseToken)
  }
})
const poolSupplyNuls = computed(() => {
  if(props.nft.projectState == 'Mint'){
    return swapSupplyNulsProgress
  }else{
    return proxy.$format.fromAmount(props.nft.ammReverseNuls*1 + props.nft.bcReverseNuls*1)
  }
})

const swapSupplyNulsProgress = computed(() => {
  return ((props.nft.mintedSupply * props.nft.mintPrice * currentChainConfig.value.swapPool)/100).toFixed(2)
})

const mintPhaseProgress = computed(() => {
  if (props.nft.mintedSupply >= targetMintSupply.value) {
    return 100
  }
  return (props.nft.mintedSupply / targetMintSupply.value * 100).toFixed(2)
})

const swapPhase = computed(() => {
  return 100-props.nft.mintPercent
})

const totalProgress = computed(() => {
  return ((props.nft.mintedSupply / props.nft.totalSupply) * 100).toFixed(2)
})

const remainingSupply = computed(() => {
  return targetMintSupply.value - props.nft.mintedSupply
})

const getFeePercentage = computed(() => {
  return tradeType.value === 'buy' ? props.nft.buyFee : props.nft.sellFee
})

const totalMintAmount = computed(() => {
  if (!amount.value) return 0
  return (Number(amount.value) * props.nft.mintPrice).toFixed(2)
})

const canMint = computed(() => {
  if (!amount.value || Number(amount.value) <= 0) return false
  return Number(amount.value) <= remainingSupply.value
})

const canSwap = computed(() => {
  if(tradeType.value == 'buy'){
    return amount.value && Number(amount.value) > 0 &&  Number(amount.value) <= 20 && poolSupplyToken >= Number(amount.value) 
  }else{
    return amount.value && Number(amount.value) > 0 &&  Number(amount.value) <=20 && nftStore.listTotal >= Number(amount.value) 
  }
  
})

const isMintPhase = computed(() => {
  return props.nft.mintedSupply < targetMintSupply.value
})

// Methods

const validateAmountInput = (event) => {
  // 只允许输入正负整数
  amount.value = event.target.value.replace(/[^-?\d]/g, '');
};

const onImageLoad = () => {
  imageLoaded.value = true
}

const handelBuyAndSell = (type) => {
  if(tradeType.value == type) return
  tradeType.value = type
  amount.value = ''
  totalSwapAmount.value = 0
}

const checkPrice = async (preset) => {
  if(!preset) return;
  amount.value = preset
  if(tradeType.value == "buy" && poolSupplyToken.value < Number(amount.value) ){
    proxy.$toast.show('Insufficient pool NFTs', 'error')
    return;
  }else if(tradeType.value == "sell" && nftStore.listTotal < Number(amount.value) ){
    proxy.$toast.show('Insufficient NFT available balance', 'error')
    return;
  }
  
  const methodName = tradeType.value == "buy" ? "getBuyCost" : "getSellAmount"
  const data = {
    contractAddress: currentChainConfig.value.contracts.mainAddress,
    methodName: methodName,
    args: [
      props.nft.pid,
      amount.value,
    ]
  }
  const result = await walletStore.invokeView(data)
  totalSwapAmount.value = proxy.$format.fromAmount(result.result) 
}

const handleMint = async () => {
  try {
    if(amount.value > 20) {
      proxy.$toast.show('A maximum of 20 NFTs can be minted at a time', 'error')
      return
    }
    const balance = proxy.$format.fromAmount(walletStore.nulsBalance)
    if(balance * 1 < totalMintAmount.value * 1) {
      proxy.$toast.show('Insufficient balance', 'error')
      return
    }
    const data = {
      from: account.value,
      value: totalMintAmount.value,
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: "mint",
      args: [
        props.nft.pid,
        amount.value,
      ]
    }
    const result = await walletStore.contractCall(data)
    console.log('mint result:', result)
    proxy.$toast.show('Transaction Submitted', 'success')
  } catch (error) {
    console.error('Mint error:', error)
    proxy.$toast.show(error, 'error')
  }
}

const handleSwap = async () => {
  try {
    if(amount.value > 20) {
      proxy.$toast.show('A maximum of 20 NFTs can be swapped at a time', 'error')
      return
    }
    let data = {
      from: account.value,
      value: totalSwapAmount.value,
      contractAddress: currentChainConfig.value.contracts.mainAddress,
      methodName: "buyToken",
      args: [
        props.nft.pid,
        amount.value,
      ]
    }
    if (tradeType.value == 'buy') {
      const balance = proxy.$format.fromAmount(walletStore.nulsBalance)
      if(balance * 1 < totalSwapAmount.value * 1) {
        proxy.$toast.show('Insufficient balance', 'error')
        return
      }
    } else if (tradeType.value == 'sell') {
      // if (!(/^-?\d+$/.test(amount.value))) {
      //   proxy.$toast.show('Please enter an integer NFT quantity', 'error')
      //   return;
      // }
      if (nftStore.listTotal < amount.value) {
        proxy.$toast.show('Insufficient NFT balance', 'error')
        return
      }
      const nftIds = []
      for (let i = 0; i < amount.value; i++) {
        const item = nftStore.heldNFTs[i]
        nftIds.push(item.tokenId)
      }
      data = {
        from: account.value,
        contractAddress: currentChainConfig.value.contracts.mainAddress,
        methodName: "sellToken",
        args: [
          props.nft.pid,
          nftIds,
        ]
      }
    }
    const result = await walletStore.contractCall(data)
    console.log('swap result:', result)
    proxy.$toast.show('Transaction Submitted', 'success')
  } catch (error) {
    console.error('Swap error:', error)
    proxy.$toast.show(error, 'error')
  }
}

const intervalId = ref(null)

// Lifecycle hooks
onMounted(() => {
  initData()
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute('data-src')
          observer.value.unobserve(img)
        }
      }
    })
  }, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  })

  if (imageRef.value) {
    observer.value.observe(imageRef.value)
  }
})

onBeforeUnmount(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
  clearInterval(intervalId.value)
})

//初始化数据
const initData = () => {
  intervalId.value = setInterval(async () => {
    if(account.value) {
      //钱包余额
      walletStore.getBalance()
      //持有的NFT数量
      nftStore.getHeldNFTs({
        address: account.value,
        nftId: props.nft.id,
        pageSize: 20
      })
    }
    nftStore.getNFTInfo(props.nft.id)
  }, 3000) //3秒执行一次
}
</script>

<style scoped>
.aspect-w-1 {
  position: relative;
  padding-bottom: 100%;
}

.aspect-w-1 > * {
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.progress-section {
  cursor: pointer;
  position: relative;
}

.progress-section:hover .progress-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translate(-50%, -5px);
}

.progress-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 0);
  margin-bottom: 15px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  z-index: 100;
  pointer-events: none;
  width: max-content;
}

.tooltip-inner {
  background-color: rgba(17, 24, 39, 0.95);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(75, 85, 99, 0.3);
  border-radius: 0.5rem;
  padding: 0.75rem;
  min-width: 12rem;
  position: relative;
  color: white;
  white-space: nowrap;
}

.tooltip-inner::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid rgba(17, 24, 39, 0.95);
}
</style>