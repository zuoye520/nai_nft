<template>
  <div class="space-y-6">
    <!-- Reply Input -->
    <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
      <textarea
        v-model="newReply"
        rows="3"
        placeholder="Write a reply..."
        class="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
      ></textarea>
      <div class="mt-4 flex justify-end">
        <BaseButton v-if="walletStore.account" primary @click="handleSubmitReply">
          Post Reply
        </BaseButton>
        <BaseButton v-else primary @click="walletStore.connect">
          Connect
        </BaseButton>
      </div>
    </div>

    <!-- Replies List -->
    <div class="space-y-6">
      <div v-for="reply in replies" :key="reply.id" class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
        <div class="flex items-start space-x-4">
          <img :src="reply.avatar" :alt="reply.author" class="w-10 h-10 rounded-full">
          <div class="flex-1">
            <div class="flex items-center space-x-2">
              <router-link :to="`/profile/${reply.author}`" class="text-white font-medium">{{ $format.shortenAddress(reply.author) }}</router-link>
              <span class="text-gray-400 text-sm">{{ $format.formatDate(reply.timestamp) }}</span>
            </div>
            <p class="mt-2 text-gray-300">{{ reply.content }}</p>
            <!-- <div class="mt-4 flex items-center space-x-4">
              <button class="text-gray-400 hover:text-gray-300 flex items-center space-x-1">
                <HandThumbUpIcon class="w-4 h-4" />
                <span>{{ reply.likes }}</span>
              </button>
              <button class="text-gray-400 hover:text-gray-300">Reply</button>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWalletStore } from '../../../stores/wallet'
const walletStore = useWalletStore()
import { useNftStore } from '../../../stores/nft'
const nftStore = useNftStore()
import { HandThumbUpIcon } from '@heroicons/vue/24/outline'
import BaseButton from '../../BaseButton.vue'

const props = defineProps({
  nft: {
    type: Object,
    required: true
  },
  replies: {
    type: Array,
    required: true
  }
})

const newReply = ref('')

// Mock replies data
// const replies = [
//   {
//     id: 1,
//     author: 'User1',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
//     content: 'Great NFT collection!',
//     timestamp: Date.now() - 3600000,
//     likes: 5
//   },
//   {
//     id: 2,
//     author: 'User2',
//     avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
//     content: 'Looking forward to the next drop!',
//     timestamp: Date.now() - 7200000,
//     likes: 3
//   }
// ]

const handleSubmitReply = async () => {
  if (!newReply.value.trim()) return
  // Handle reply submission
  console.log('Submitting reply:', newReply.value)
  
  await nftStore.nftReply({id:props.nft.id,content:newReply.value})
  await nftStore.getNftReplyList({id:props.nft.id})
  newReply.value = ''
}
// const shortenAddress = (address) => {
//   return `${address.slice(0, 6)}...${address.slice(-4)}`
// }
// const formatDate = (timestamp) => {
//   return new Date(timestamp).toLocaleString()
// }
</script>