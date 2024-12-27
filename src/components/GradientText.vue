<template>
  <span 
    :class="[
      'bg-gradient-to-r bg-clip-text text-transparent font-bold',
      gradients[type] || gradients.default
    ]"
  >
    <slot></slot>
  </span>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'default'
  }
})

const gradients = {
  default: 'from-green-400 via-blue-500 to-purple-600',
  primary: 'from-green-400 to-blue-500',
  secondary: 'from-orange-500 to-pink-500'
}
</script>