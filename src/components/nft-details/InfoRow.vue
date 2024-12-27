<template>
  <div class="flex justify-between items-center">
    <span class="text-gray-400">{{ label }}</span>
    <span class="text-white font-medium">{{ value }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})
</script>