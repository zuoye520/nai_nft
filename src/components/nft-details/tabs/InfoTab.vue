<template>
  <div class="space-y-6">
    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <h3 class="text-xl font-semibold text-white mb-4">Collection Info</h3>
      <div class="space-y-4">
        <InfoRowLink label="Contract Address" :value="nft.contractAddress" />
        <InfoRow label="Collection Name" :value="nft.name" />
        <InfoRow label="Total Supply" :value="nft.totalSupply" />
        <InfoRow label="Market Cap" :value="marketCap()" />
        <InfoRow label="Mint Price" :value="`${nft.mintPrice} NULS`" />
        <InfoRow label="Mint Percent" :value="`${nft.mintPercent}%`" />
        <InfoRow label="Buy Fee" :value="`${nft.buyFee}%`" />
        <InfoRow label="Sell Fee" :value="`${nft.sellFee}%`" />
      </div>
    </div>

    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800" v-if="nft.description">
      <h3 class="text-xl font-semibold text-white mb-4">Description</h3>
      <p class="text-gray-300">{{ nft.description }}</p>
    </div>

    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800" v-if="nft.social.twitter || nft.social.telegram || nft.social.website">
      <h3 class="text-xl font-semibold text-white mb-4">Social Links</h3>
      <div class="flex space-x-4">
        <SocialLink v-if="nft.social?.twitter" icon="twitter" :href="nft.social.twitter" />
        <SocialLink v-if="nft.social?.telegram" icon="telegram" :href="nft.social.telegram" />
        <SocialLink v-if="nft.social?.website" icon="website" :href="nft.social.website" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useWalletStore } from '../../../stores/wallet'
const walletStore = useWalletStore()
const { proxy } = getCurrentInstance()
import InfoRow from '../InfoRow.vue'
import InfoRowLink from '../InfoRowLink.vue'
import SocialLink from '../SocialLink.vue'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  }
})
const marketCap = () => {
  let usd = proxy.$format.formatLargeNumber(props.nft.marketValue * walletStore.nulsUsdPrice)
  usd = usd*1 > 0 ?` ≈ $${usd} `: ''
  return `${props.nft.marketValue} NULS${usd}`
}



</script>