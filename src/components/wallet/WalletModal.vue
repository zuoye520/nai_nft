<template>
  <Teleport to="body">
    <div v-if="store.showWalletModal" class="fixed inset-0 z-50">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/80" 
        @click="store.toggleWalletModal"
      ></div>
      
      <!-- Modal -->
      <div class="absolute top-20 right-4 w-80 rounded-xl bg-[#1A1B1E] border border-gray-800 shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="p-4 border-b border-gray-800">
          <div class="flex items-center space-x-3">
            <img 
              :src="generateAvatarUrl(store.address)" 
              :alt="shortenAddress(store.address)"
              class="w-12 h-12 rounded-full"
            />
            <div>
              <div class="text-white font-medium">{{ shortenAddress(store.address) }}</div>
              <button 
                @click="copyAddress"
                class="text-sm text-gray-400 hover:text-green-400 flex items-center space-x-1"
              >
                <DocumentDuplicateIcon class="w-4 h-4" />
                <span>Copy Address</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="p-2">
          <router-link 
            to="/profile"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-white transition-colors"
            @click="store.toggleWalletModal"
          >
            <UserIcon class="w-5 h-5" />
            <span>View Profile</span>
          </router-link>
          
          <router-link 
            to="/rewards"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-white transition-colors"
            @click="store.toggleWalletModal"
          >
            <GiftIcon class="w-5 h-5" />
            <span>Rewards</span>
          </router-link>

          <router-link 
            to="/refer"
            class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 text-white transition-colors"
            @click="store.toggleWalletModal"
          >
            <UserPlusIcon class="w-5 h-5" />
            <span>Refer Friends</span>
          </router-link>

          <div class="px-2 pt-2 mt-2 border-t border-gray-800">
            <button 
              @click="handleDisconnect"
              class="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
            >
              <ArrowRightOnRectangleIcon class="w-5 h-5" />
              <span>Disconnect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useWalletStore } from '../../stores/wallet'
import { 
  UserIcon, 
  UserPlusIcon,
  ArrowRightOnRectangleIcon,
  DocumentDuplicateIcon,
  GiftIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const store = useWalletStore()

const generateAvatarUrl = (address) => {
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`
}

const shortenAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 8)}...${address.slice(-4)}`
}

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(store.address)
    // Could add a toast notification here
  } catch (error) {
    console.error('Failed to copy address:', error)
  }
}

const handleDisconnect = () => {
  store.disconnect()
  router.push('/')
}
</script>