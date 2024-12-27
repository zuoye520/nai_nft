<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-1">
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <template v-if="type === 'textarea'">
      <textarea
        :id="id"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full bg-gray-800/50 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500',
          error ? 'border-red-500' : 'border-gray-700'
        ]"
      />
    </template>
    <template v-else>
      <input
        :id="id"
        :type="type"
        v-bind="$attrs"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :class="[
          'w-full bg-gray-800/50 border rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500',
          error ? 'border-red-500' : 'border-gray-700'
        ]"
      />
    </template>
    <ValidationError :error="error" />
  </div>
</template>

<script setup>
import ValidationError from './ValidationError.vue'

defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
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

defineEmits(['update:modelValue'])
</script>