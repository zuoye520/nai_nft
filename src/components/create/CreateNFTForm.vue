<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <!-- Basic Info Section -->
    <BasicInfoSection 
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />

    <!-- Fees Section -->
    <FeesSection 
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />
    
    <!-- Description Section -->
    <DescriptionSection 
      :values="values"
      :errors="errors"
      @update:field="handleFieldUpdate"
      @blur="handleBlur"
    />

    <!-- Social Links Section -->
    <div class="pt-4">
      <button
        type="button"
        class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
        @click="showSocial = !showSocial"
      >
        <ChevronRightIcon
          class="w-5 h-5 transition-transform"
          :class="{ 'rotate-90': showSocial }"
        />
        Show more options
      </button>
      
      <SocialLinksSection 
        v-show="showSocial"
        :values="values"
        :errors="errors"
        @update:field="handleFieldUpdate"
        @blur="handleBlur"
      />
    </div>

    <!-- Submit Button -->
    <div class="pt-6">
      <BaseButton type="submit" primary class="w-full">
        Create Collection
      </BaseButton>
    </div>

    <!-- Gas Fee Notice -->
    <GasFeeNotice />
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import BaseButton from '../BaseButton.vue'
import BasicInfoSection from './sections/BasicInfoSection.vue'
import FeesSection from './sections/FeesSection.vue'
import DescriptionSection from './sections/DescriptionSection.vue'
import SocialLinksSection from './sections/SocialLinksSection.vue'
import GasFeeNotice from './notices/GasFeeNotice.vue'
import { useNFTValidation } from '../../composables/useNFTValidation'

const router = useRouter()
const showSocial = ref(false)

const { handleSubmit, values, errors, validateField, setFieldValue } = useNFTValidation()

const handleFieldUpdate = (field, value) => {
  setFieldValue(field, value)
}

const handleBlur = (field) => {
  validateField(field)
}

const onSubmit = handleSubmit(async (values) => {
  try {
    console.log('Form submitted:', values)
    // Handle form submission
    router.push('/')
  } catch (error) {
    console.error('Error submitting form:', error)
  }
})
</script>