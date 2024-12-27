<template>
  <button
    class="relative py-4 px-1 focus:outline-none"
    :class="[
      active 
        ? 'text-green-400' 
        : 'text-gray-400 hover:text-gray-300'
    ]"
  >
    <!-- Active Tab Indicator -->
    <span
      class="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 to-blue-500"
      :class="{ 'opacity-100': active, 'opacity-0': !active }"
    />
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})
</script>