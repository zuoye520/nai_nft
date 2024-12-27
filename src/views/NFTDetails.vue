<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- NFT Header Section -->
      <NFTHeader :nft="nft" />

      <!-- Tabs Navigation -->
      <div class="mt-8 border-b border-gray-800">
        <nav class="flex space-x-8">
          <TabButton 
            v-for="tab in tabs" 
            :key="tab.id"
            :active="activeTab === tab.id"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </TabButton>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <InfoTab v-if="activeTab === 'info'" :nft="nft" />
        <ChartTab v-else-if="activeTab === 'chart'" :nft="nft" />
        <TradeTab 
          v-else-if="activeTab === 'trade'" 
          :nft="nft"
          :tradeType="nft.phase"
        />
        <TransactionsTab v-else-if="activeTab === 'transactions'" :nft="nft" />
        <RepliesTab v-else-if="activeTab === 'replies'" :nft="nft" />
        <HoldersTab v-else-if="activeTab === 'holders'" :nft="nft" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NFTHeader from '../components/nft-details/NFTHeader.vue'
import TabButton from '../components/nft-details/TabButton.vue'
import InfoTab from '../components/nft-details/tabs/InfoTab.vue'
import ChartTab from '../components/nft-details/tabs/ChartTab.vue'
import TradeTab from '../components/nft-details/tabs/TradeTab.vue'
import TransactionsTab from '../components/nft-details/tabs/TransactionsTab.vue'
import RepliesTab from '../components/nft-details/tabs/RepliesTab.vue'
import HoldersTab from '../components/nft-details/tabs/HoldersTab.vue'
import { useNFTDetails } from '../composables/useNFTDetails'

const route = useRoute()
const { nft, fetchNFTDetails } = useNFTDetails(route.params.id)

const activeTab = ref('info')
const tabs = [
  { id: 'info', name: 'Info' },
  { id: 'chart', name: 'Chart' },
  // { id: 'trade', name: nft.value.phase === 'mint' ? 'Mint' : 'Swap' },
  { id: 'transactions', name: 'TXN' },
  { id: 'replies', name: 'Reply' },
  { id: 'holders', name: 'Holders' }
]

onMounted(() => {
  fetchNFTDetails()
})
</script>