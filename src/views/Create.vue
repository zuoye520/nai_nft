<template>
  <div class="min-h-screen py-12 bg-black">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-4xl font-bold text-white mb-8">Create NFT Collection</h1>
        
        <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <CreateNFTForm />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import CreateNFTForm from '../components/create/CreateNFTForm.vue'
</script>