<template>
  <div class="space-y-6">
    <FormField
      id="collection-name"
      label="NFT Collection Name"
      v-model="values.collectionName"
      :error="errors.collectionName"
      placeholder="Enter collection name"
      required
      @blur="$emit('blur', 'collectionName')"
      @update:modelValue="updateField('collectionName', $event)"
    />

    <FormField
      id="nft-count"
      label="Number of NFTs to generate"
      type="number"
      v-model="values.nftCount"
      :error="errors.nftCount"
      placeholder="100~1000"
      min="100"
      max="1000"
      required
      @blur="$emit('blur', 'nftCount')"
      @update:modelValue="updateField('nftCount', $event)"
    />

    <ImageUpload
      label="NFT Image"
      :modelValue="values.image"
      :error="errors.image"
      :preview="imagePreview"
      @update:modelValue="handleImageChange"
      @blur="$emit('blur', 'image')"
      required
    />

    <FormField
      id="mint-price"
      label="Mint Price (NULS)"
      type="number"
      v-model="values.mintPrice"
      :error="errors.mintPrice"
      placeholder="10"
      min="10"
      step="0.1"
      required
      @blur="$emit('blur', 'mintPrice')"
      @update:modelValue="updateField('mintPrice', $event)"
    />

    <FormField
      id="mint-percent"
      label="Mint Percent"
      type="number"
      v-model="values.mintPercent"
      :error="errors.mintPercent"
      placeholder="60~80"
      min="60"
      max="80"
      step="0.1"
      required
      @blur="$emit('blur', 'mintPercent')"
      @update:modelValue="updateField('mintPercent', $event)"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FormField from '../../forms/FormField.vue'
import ImageUpload from '../../forms/ImageUpload.vue'

const props = defineProps({
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

const imagePreview = ref('')

const updateField = (field, value) => {
  emit('update:field', field, value)
}

const handleImageChange = (file) => {
  emit('update:field', 'image', file)
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}
</script>