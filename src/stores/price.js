import { defineStore } from 'pinia'
import { ref,computed } from 'vue'
import * as api from '../services/api'
import {fromAmount,formatUsd} from '../utils/format'
export const usePriceStore = defineStore('price', () => {
  
  async function getMockPrice() {
    const result = await api.mockPrice()
    return result;
  }
  
  return {
    getMockPrice,
  }
})