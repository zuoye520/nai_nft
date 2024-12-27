<template>
  <div class="space-y-6 pt-4">
    <FormField
      id="twitter"
      label="X (Twitter)"
      v-model="values.social.twitter"
      :error="errors['social.twitter']"
      placeholder="https://twitter.com/username"
      @blur="$emit('blur', 'social.twitter')"
      @update:modelValue="updateField('social.twitter', $event)"
    />

    <FormField
      id="telegram"
      label="Telegram"
      v-model="values.social.telegram"
      :error="errors['social.telegram']"
      placeholder="https://t.me/username"
      @blur="$emit('blur', 'social.telegram')"
      @update:modelValue="updateField('social.telegram', $event)"
    />

    <FormField
      id="website"
      label="Website"
      v-model="values.social.website"
      :error="errors['social.website']"
      placeholder="https://example.com"
      @blur="$emit('blur', 'social.website')"
      @update:modelValue="updateField('social.website', $event)"
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