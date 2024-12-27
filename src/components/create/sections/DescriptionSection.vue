<template>
  <div>
    <FormField
      id="description"
      label="NFT Description"
      type="textarea"
      v-model="values.description"
      :error="errors.description"
      rows="4"
      placeholder="Enter collection description"
      @blur="$emit('blur', 'description')"
      @update:modelValue="updateField('description', $event)"
    />
  </div>
</template>

<script setup>
import FormField from '../../forms/FormField.vue'

defineProps({
  values: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:field', 'blur'])

const updateField = (field, value) => {
  emit('update:field', field, value)
}
</script>