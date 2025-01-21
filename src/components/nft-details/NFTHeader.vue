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
      
      <div class="mt-6">
        <div class="flex items-center space-x-2">
          <span class="text-gray-400">Created by</span>
          <router-link :to="`/profile/${nft.creator}`" class="text-white font-medium">
            {{ $format.shortenAddress(nft.creator) }}
          </router-link>
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
                  class="px-2 py-1 text-sm rounded bg-gray-800 text-gray-400 hover:text-green-400 transition-colors "
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
                <span  class="text-green-400">{{ tradeType === 'buy' ? `${$format.fromAmount( walletStore.nulsBalance)} NULS`: `${nftStore.listTotal} NFT`}} </span>
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
import { ref, computed, onMounted, onBeforeUnmount,getCurrentInstance } from 'vue'
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

// Computed properties
const mintProgress = computed(() => {
  return ((props.nft.mintedSupply / (props.nft.totalSupply * props.nft.mintPercent / 100)) * 100).toFixed(1)
})

const isMintPhase = computed(() => {
  return Number(mintProgress.value) < 100
})

const remainingSupply = computed(() => {
  return (props.nft.totalSupply * props.nft.mintPercent / 100) - props.nft.mintedSupply
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
  return amount.value && Number(amount.value) > 0 && totalSwapAmount.value
})

// Methods
const onImageLoad = () => {
  imageLoaded.value = true
}

const handelBuyAndSell = (type)=>{
  if(tradeType.value == type) return;
  tradeType.value = type;
  amount.value = '';
  totalSwapAmount.value = 0
}
const checkPrice = async (preset) => {
  amount.value = preset
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
    if(amount.value >20){
      proxy.$toast.show('A maximum of 20 NFTs can be minted at a time', 'error')
      return;
    }
    const balance = proxy.$format.fromAmount(walletStore.nulsBalance)
    if( balance*1 < totalMintAmount.value*1){
      proxy.$toast.show('Insufficient balance', 'error')
      return;
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
    if(amount.value > 20){
      proxy.$toast.show('A maximum of 20 NFTs can be swapped at a time', 'error')
      return;
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
      if( balance*1 < totalSwapAmount.value*1){
        proxy.$toast.show('Insufficient balance', 'error')
        return;
      }
    }else if (tradeType.value == 'sell') {
      if (nftStore.listTotal < amount.value) {
        proxy.$toast.show('Insufficient NFT balance', 'error')
        return;
      }
      const nftIds = [] //heldList.map((item) => item.tokenId)
      for (let i = 0; i < amount.value; i++) {
        const item = nftStore.heldNFTs[i];
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
  clearInterval(intervalId.value);
})

//初始化数据
const initData = ()=>{
  intervalId.value = setInterval(async () => {
    if(account.value){
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
  }, 3000);//3秒执行一次
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
</style>
