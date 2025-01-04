import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import copy from 'copy-to-clipboard';
import * as api from '../services/api'
import { useWalletStore } from './wallet';
export const useReferStore = defineStore('refer', () => {
  const walletStore = useWalletStore();
  const referralLink = ref(`https://nuls.io?ref=${walletStore.account}`)

  const stats = ref({
    totalReferrals: 0,
    totalEarnings: '0'
  })
  // Mock
  const referralHistory = ref([
    {
      user: 'NULSd6Hg...Bq97',
      date: '2024.01.26 10:44:07',
      reward: '0.00606'
    },
    {
      user: 'NULSd6Hg...Xy42',
      date: '2024.01.25 14:55:14',
      reward: '0.00369'
    }
  ])
  //奖励列表
  async function getHistoryRefers() {
    const result = await api.historyRefers();
    nfts.value = result.list;
  }
  //copy 邀请链接
  function copyReferralLink(){
    copy(account.value)
  }

  return {
    referralLink,
    stats,
    referralHistory,
    copyReferralLink,
    getHistoryRefers
  }
})