<template>
  <div class="space-y-6">
    <!-- <FormField
      id="buy-fee"
      label="Buy Fee (%)"
      type="number"
      v-model="values.buyFee"
      :error="errors.buyFee"
      placeholder="1~50"
      min="1"
      max="50"
      step="0.1"
      required
      @blur="$emit('blur', 'buyFee')"
      @update:modelValue="updateField('buyFee', $event)"
    />

    <FormField
      id="sell-fee"
      label="Sell Fee (%)"
      type="number"
      v-model="values.sellFee"
      :error="errors.sellFee"
      placeholder="1~50"
      min="1"
      max="50"
      step="0.1"
      required
      @blur="$emit('blur', 'sellFee')"
      @update:modelValue="updateField('sellFee', $event)"
    /> -->

    <FormField
      id="swap-fee"
      label="Swap Fee (%)"
      type="number"
      v-model="values.swapFee"
      :error="errors.swapFee"
      placeholder="1~50"
      min="1"
      max="50"
      step="0.1"
      required
      @blur="$emit('blur', 'swapFee')"
      @update:modelValue="updateField('swapFee', $event)"
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