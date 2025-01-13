<template>
  <div 
    class="relative"
    :class="[
      { 'min-h-[100px]': active },
      sizeClasses[size]
    ]"
  >
    <!-- Content -->
    <div 
      :class="[
        { 'opacity-50': active && !preserveContent },
        { 'pointer-events-none': active },
        contentClass
      ]"
    >
      <slot></slot>
    </div>

    <!-- Loading Overlay -->
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="active"
        :class="[
          'absolute inset-0 flex items-center justify-center rounded-lg',
          overlayClass || 'bg-black/20 backdrop-blur-sm'
        ]"
      >
        <div class="text-center">
          <!-- Custom Loading Slot -->
          <slot name="loading">
            <!-- Default Spinner -->
            <div class="inline-block relative">
              <!-- Outer Ring -->
              <div 
                class="absolute inset-0 rounded-full border-2"
                :class="[borderClass || 'border-green-500/30']"
              ></div>
              
              <!-- Spinning Ring -->
              <div :class="spinnerSizeClasses[size]">
                <svg 
                  class="animate-spin" 
                  :class="[spinnerColorClass || 'text-green-500']"
                  viewBox="0 0 24 24"
                >
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
                  ></circle>
                  <path 
                    class="opacity-75" 
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              
              <!-- Pulse Effect -->
              <div 
                v-if="showPulse"
                class="absolute inset-0 animate-ping rounded-full"
                :class="[pulseClass || 'bg-green-500/20']"
              ></div>
            </div>
          </slot>

          <!-- Loading Message -->
          <Transition
            enter-active-class="transition-all duration-200 delay-100"
            enter-from-class="opacity-0 transform translate-y-2"
            enter-to-class="opacity-100 transform translate-y-0"
            leave-active-class="transition-all duration-150"
            leave-from-class="opacity-100 transform translate-y-0"
            leave-to-class="opacity-0 transform translate-y-2"
          >
            <div v-if="message" class="mt-2">
              <span 
                class="text-sm font-medium"
                :class="[messageClass || 'text-green-400']"
              >
                {{ message }}
              </span>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const props = defineProps({
  // 是否激活加载状态
  active: {
    type: Boolean,
    default: false
  },
  // 加载提示文本
  message: {
    type: String,
    default: ''
  },
  // 加载器大小
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  // 是否显示脉冲效果
  showPulse: {
    type: Boolean,
    default: true
  },
  // 是否保持内容不透明
  preserveContent: {
    type: Boolean,
    default: false
  },
  // 自定义类名
  overlayClass: {
    type: String,
    default: ''
  },
  contentClass: {
    type: String,
    default: ''
  },
  spinnerColorClass: {
    type: String,
    default: ''
  },
  borderClass: {
    type: String,
    default: ''
  },
  pulseClass: {
    type: String,
    default: ''
  },
  messageClass: {
    type: String,
    default: ''
  }
})

// 大小相关的类名映射
const sizeClasses = {
  sm: 'min-h-[60px]',
  md: 'min-h-[100px]',
  lg: 'min-h-[140px]'
}

const spinnerSizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
}
</script>