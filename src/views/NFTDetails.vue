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
            @click="handleActiveTab(tab.id)"
          >
            {{ tab.name }}
          </TabButton>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="mt-8">
        <InfoTab v-if="activeTab === 'info'" :nft="nft" />
        <ChartTab v-else-if="activeTab === 'chart'" :nft="nft" :prices="prices"/>
        <TradeTab 
          v-else-if="activeTab === 'trade'" 
          :nft="nft"
          :tradeType="nft.phase"
        />
        <TransactionsTab v-else-if="activeTab === 'transactions'" :nft="nft" :transactions = "transactions"/>
        <RepliesTab v-else-if="activeTab === 'replies'" :nft="nft" :replies="replies"/>
        <HoldersTab v-else-if="activeTab === 'holders'" :nft="nft" :holders = "holders"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, getCurrentInstance, onMounted, onUnmounted, onBeforeMount, onUpdated } from 'vue'
import { useRoute } from 'vue-router'
import NFTHeader from '../components/nft-details/NFTHeader.vue'
import TabButton from '../components/nft-details/TabButton.vue'
import InfoTab from '../components/nft-details/tabs/InfoTab.vue'
import ChartTab from '../components/nft-details/tabs/ChartTab.vue'
import TradeTab from '../components/nft-details/tabs/TradeTab.vue'
import TransactionsTab from '../components/nft-details/tabs/TransactionsTab.vue'
import RepliesTab from '../components/nft-details/tabs/RepliesTab.vue'
import HoldersTab from '../components/nft-details/tabs/HoldersTab.vue'
// import { useNFTDetails } from '../composables/useNFTDetails'
// const { nft, fetchNFTDetails } = useNFTDetails(route.params.id)
import { storeToRefs } from 'pinia'
import { useWalletStore } from '../stores/wallet'
const walletStore = useWalletStore()
import { useNftStore } from '../stores/nft'
const nftStore = useNftStore()
const { nftInfo:nft,nftHolders:holders,replies,transactions,prices } = storeToRefs(nftStore)
const route = useRoute()


const activeTab = ref('info')
const tabs = [
  { id: 'info', name: 'Info' },
  { id: 'chart', name: 'Chart' },
  // { id: 'trade', name: nft.value.phase === 'mint' ? 'Mint' : 'Swap' },
  { id: 'transactions', name: 'TXN' },
  { id: 'replies', name: 'Reply' },
  { id: 'holders', name: 'Holders' }
]
const handleActiveTab = (id)=>{
  activeTab.value = id
  if(id == 'holders'){
    nftStore.getNftHolders(route.params.id)
  }else if(id == 'replies'){
    nftStore.getNftReplyList({id:route.params.id})
  }else if(id == 'transactions'){
    nftStore.getNftTxn({id:route.params.id})
  }else if(id == 'chart'){
    // nftStore.getNftTxn({id:route.params.id})
  }
}
onBeforeMount(() => {
  console.log('Component will be mounted')
  window.scrollTo({ top: 0, behavior: 'smooth' });
})
onMounted(() => {
  initData()
})
const initData = ()=>{
  nftStore.getNFTInfo(route.params.id)
}
</script>