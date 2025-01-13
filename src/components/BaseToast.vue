<template>
  <div class="fixed inset-x-0 top-4 z-[9999] flex items-center justify-center pointer-events-none">
    <TransitionGroup
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-4 opacity-0"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto mb-2 last:mb-0"
      >
        <div
          class="max-w-sm rounded-lg shadow-lg px-4 py-3 flex items-center space-x-3 backdrop-blur-sm"
          :class="[
            toast.type === 'success' ? 'bg-green-500/90 text-white' : '',
            toast.type === 'error' ? 'bg-red-500/90 text-white' : '',
            toast.type === 'warning' ? 'bg-yellow-500/90 text-white' : '',
            toast.type === 'info' ? 'bg-blue-500/90 text-white' : '',
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <CheckCircleIcon v-if="toast.type === 'success'" class="h-5 w-5" />
            <XCircleIcon v-else-if="toast.type === 'error'" class="h-5 w-5" />
            <ExclamationTriangleIcon v-else-if="toast.type === 'warning'" class="h-5 w-5" />
            <InformationCircleIcon v-else class="h-5 w-5" />
          </div>

          <!-- Message -->
          <div class="flex-1 text-sm font-medium">
            {{ toast.message }}
          </div>

          <!-- Close Button -->
          <button
            @click="removeToast(toast.id)"
            class="flex-shrink-0 ml-2 hover:opacity-80 transition-opacity focus:outline-none"
          >
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const toasts = ref([])
const toastTimeout = ref(3000) // Default timeout

const addToast = (message, type = 'info') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })

  // Auto remove toast after timeout
  setTimeout(() => {
    removeToast(id)
  }, toastTimeout.value)
}

const removeToast = (id) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose methods to template
defineExpose({
  addToast,
  removeToast
})

// Clean up any remaining toasts when component unmounts
onUnmounted(() => {
  toasts.value = []
})
</script>