<template>
  <div>
    <label class="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <div 
      class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors"
      :class="[
        error 
          ? 'border-red-500 hover:border-red-400' 
          : 'border-gray-800 hover:border-green-500/50'
      ]"
    >
      <div class="space-y-1 text-center">
        <div v-if="preview" class="mb-4">
          <img :src="preview" alt="Preview" class="mx-auto h-32 w-32 object-cover rounded-lg" />
        </div>
        <div v-else>
          <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <div class="flex text-sm text-gray-400">
          <label class="relative cursor-pointer rounded-md font-medium text-green-400 hover:text-green-300">
            <span>Upload a file</span>
            <input 
              type="file" 
              class="sr-only" 
              @change="handleFileChange" 
              accept="image/*"
            >
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
        <p v-if="error" class="mt-2 text-sm text-red-500">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [File, null],
    default: null
  },
  preview: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'blur'])

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    emit('update:modelValue', file)
    emit('blur', 'image')
  }
}
</script>