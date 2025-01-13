<template>
  <button
    :class="[
      'inline-flex items-center justify-center px-6 py-2 rounded-xl font-medium transition-all duration-300',
      primary 
        ? 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg shadow-green-500/20' 
        : 'bg-nft-card text-white hover:bg-gray-800 border border-gray-800 hover:border-green-500/30',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-black',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ]"
    v-bind="$attrs"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  primary: {
    type: Boolean,
    default: false
  }
})
</script>