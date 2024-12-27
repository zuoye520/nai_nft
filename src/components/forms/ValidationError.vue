<template>
  <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: ''
  }
})
</script>