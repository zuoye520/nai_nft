<template>
  <div class="flex justify-between items-center">
    <span class="text-gray-400">{{ label }}</span>
    <span class="text-white font-medium" ><button @click="store.openExplorerContract(value)">{{ value && $format.shortenAddress(value) }}</button></span>
  </div>
</template>

<script setup>
import { useWalletStore } from '../../stores/wallet'
const store = useWalletStore()
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
})
</script>