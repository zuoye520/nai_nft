<template>
  <div class="fixed inset-0 -z-10">
    <!-- Gradient Background -->
    <div class="absolute inset-0 bg-black">
      <div class="absolute inset-0 bg-gradient-radial from-green-500/10 via-blue-500/5 to-purple-500/5 animate-pulse-slow"></div>
    </div>
    
    <!-- Animated Blobs -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="animate-blob absolute -top-48 left-0 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div class="animate-blob animation-delay-2000 absolute top-0 -right-48 w-96 h-96 bg-green-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      <div class="animate-blob animation-delay-4000 absolute -bottom-48 left-48 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
    </div>
  </div>
</template>