```vue
<template>
  <div class="relative">
    <!-- Full Screen Overlay -->
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="fullscreen" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <!-- Loading Content -->
        <div class="relative flex items-center justify-center min-h-screen p-4">
          <div class="text-center">
            <!-- Spinner -->
            <div class="inline-block relative">
              <!-- Outer Ring -->
              <div class="absolute inset-0 rounded-full border-2 border-green-500/30"></div>
              
              <!-- Spinning Ring -->
              <svg class="animate-spin h-12 w-12" viewBox="0 0 24 24">
                <circle 
                  class="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  stroke-width="4"
                  fill="none"
                  stroke-dasharray="16 48"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-dashoffset="0"
                  stroke-class="text-green-500"
                ></circle>
                <path 
                  class="opacity-75" 
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              
              <!-- Pulse Effect -->
              <div class="absolute inset-0 animate-ping rounded-full bg-green-500/20"></div>
            </div>

            <!-- Loading Message -->
            <Transition
              enter-active-class="transition ease-out duration-200 delay-150"
              enter-from-class="opacity-0 translate-y-4"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition ease-in duration-150"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-4"
            >
              <div v-if="message" class="mt-4">
                <span class="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-400 font-medium">
                  {{ message }}
                </span>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Inline Loading -->
    <div v-if="!fullscreen" class="flex items-center justify-center p-4">
      <div class="text-center">
        <!-- Spinner -->
        <div class="inline-block relative">
          <svg class="animate-spin h-8 w-8 text-green-500" viewBox="0 0 24 24">
            <circle 
              class="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="4"
              fill="none"
            ></circle>
            <path 
              class="opacity-75" 
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
        
        <!-- Message -->
        <div v-if="message" class="mt-3 text-green-400 font-medium">
          {{ message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  // 是否全屏显示
  fullscreen: {
    type: Boolean,
    default: false
  },
  // 加载提示文本
  message: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
/* 自定义动画关键帧 */
@keyframes pulse-ring {
  0% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

/* 应用动画 */
.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
```