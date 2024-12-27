// src/stores/wallet.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWalletStore = defineStore('wallet', () => {
  const isConnected = ref(false)
  const address = ref('')
  const showWalletModal = ref(false)

  function connect() {
    // Mock wallet connection
    address.value = 'NULSd6HgUdBMZGbB18D1gVd1VoGqBq97'
    isConnected.value = true
    // Remove this line so modal doesn't show automatically
    // showWalletModal.value = true 
  }

  function disconnect() {
    address.value = ''
    isConnected.value = false
    showWalletModal.value = false
  }

  function toggleWalletModal() {
    showWalletModal.value = !showWalletModal.value
  }

  return {
    isConnected,
    address,
    showWalletModal,
    connect,
    disconnect,
    toggleWalletModal
  }
})
