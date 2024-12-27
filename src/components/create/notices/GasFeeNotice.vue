<template>
  <div class="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
    <div class="flex items-start">
      <div class="flex-shrink-0">
        <InformationCircleIcon class="h-5 w-5 text-green-400" aria-hidden="true" />
      </div>
      <div class="ml-3">
        <h3 class="text-sm font-medium text-green-400">Gas Fee Information</h3>
        <div class="mt-2 text-sm text-gray-300">
          <p>Create gas fee: <span class="font-semibold text-green-400">10 NULS</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { InformationCircleIcon } from '@heroicons/vue/24/outline'
</script>