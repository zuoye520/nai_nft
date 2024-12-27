<template>
  <div class="space-y-6">
    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <h3 class="text-xl font-semibold text-white mb-4">Collection Info</h3>
      <div class="space-y-4">
        <InfoRow label="Collection Name" :value="nft.name" />
        <InfoRow label="Total Supply" :value="nft.totalSupply" />
        <InfoRow label="Mint Price" :value="`${nft.mintPrice} NULS`" />
        <InfoRow label="Mint Percent" :value="`${nft.mintPercent}%`" />
        <InfoRow label="Buy Fee" :value="`${nft.buyFee}%`" />
        <InfoRow label="Sell Fee" :value="`${nft.sellFee}%`" />
      </div>
    </div>

    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <h3 class="text-xl font-semibold text-white mb-4">Description</h3>
      <p class="text-gray-300">{{ nft.description }}</p>
    </div>

    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
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
import InfoRow from '../InfoRow.vue'
import SocialLink from '../SocialLink.vue'

defineProps({
  nft: {
    type: Object,
    required: true
  }
})
</script>