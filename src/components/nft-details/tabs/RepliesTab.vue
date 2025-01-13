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
    <BaseLocalLoading :active="isLoading" message="Loading data...">
      <div class="space-y-6">
        <div v-for="reply in nftStore.replies" :key="reply.id" class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <div class="flex items-start space-x-4">
            <img :src="reply.avatar" :alt="reply.author" class="w-10 h-10 rounded-full">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <router-link :to="`/profile/${reply.author}`" class="text-white font-medium">{{ $format.shortenAddress(reply.author) }}</router-link>
                <span class="text-gray-400 text-sm">{{ $format.formatDate(reply.timestamp) }}</span>
              </div>
              <p class="mt-2 text-gray-300">{{ reply.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </BaseLocalLoading>
    <BasePagination
      v-model:currentPage="currentPage"
      :pageSize="pageSize"
      :total="nftStore.repliesTotal"
    />
  </div>
</template>

<script setup>
import { ref,inject,watch,getCurrentInstance } from 'vue'
import { useWalletStore } from '../../../stores/wallet'
const walletStore = useWalletStore()
import { useNftStore } from '../../../stores/nft'
const nftStore = useNftStore()
import { HandThumbUpIcon } from '@heroicons/vue/24/outline'
import BaseButton from '../../BaseButton.vue'
import BaseLocalLoading from "../../../components/BaseLocalLoading.vue";
import BasePagination from '../../../components/BasePagination.vue'
const { proxy } = getCurrentInstance();
const loading = inject('loading')
const props = defineProps({
  isLoading: {
    type: Boolean,
    required: true,
  },
  nft: {
    type: Object,
    required: true
  },
})

const newReply = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 监听页码变化
watch(currentPage, (newPage) => {
  console.log('newPage:',newPage)
  // 加载新页数据
  initData()
})
const initData = ()=>{
  nftStore.getNftReplyList({
    id:props.nft.id,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
  })
}
const handleSubmitReply = async () => {
  if (!newReply.value.trim()) return
  loading.show('Loading ...')
  // Handle reply submission
  console.log('Submitting reply:', newReply.value)
  
  await nftStore.nftReply({id:props.nft.id,content:newReply.value})
  initData()
  newReply.value = ''
  loading.hide()
  proxy.$toast.show('Reply Success', 'success')
}

</script>