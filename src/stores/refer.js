import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import copy from 'copy-to-clipboard';
import * as api from '../services/api'
import { useWalletStore } from './wallet';
import { useGlobalToast } from '../plugins/toast'
import {fromAmount,formatUsd} from '../utils/format'
export const useReferStore = defineStore('refer', () => {
  const walletStore = useWalletStore();
  const toast = useGlobalToast()

  const referralLink = ref(``)

  const stats = ref({
    totalReferrals: 0,
    totalEarnings: '0'
  })
  const referralHistoryTotal = ref(0)
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
  async function getHistoryRefers(params) {
    const result = await api.historyRefers(params);
    const list = result.list.map((item)=>{
      item.user = item.inviteeAddress
      item.reward = fromAmount(item.amount)
      item.date = item.createdDate
      return item
    })

    referralHistoryTotal.value = result.totalCount

    referralHistory.value = list;

  }
  //copy 邀请链接
  function copyReferralLink(){
    copy(referralLink.value)
    toast.show('Copy Success', 'success')
  }

  return {
    referralLink,
    stats,
    referralHistory,
    copyReferralLink,
    referralHistoryTotal,
    getHistoryRefers
  }
})