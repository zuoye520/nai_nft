import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../services/api'
import { useWalletStore } from './wallet';
export const useRewardsStore = defineStore('rewards', () => {
  const walletStore = useWalletStore();
  //可领取的奖励
  const rewards = ref(0)
  // rewardHistory Mock
  const rewardHistory = ref([
    {
      type: 'Lucky Bonus',
      date: '2024.01.26 10:44:07',
      amount: '+0.00606'
    },
    {
      type: 'Mint Reward',
      date: '2024.01.25 14:55:14',
      amount: '+0.00369'
    },
    {
      type: 'Withdrawal',
      date: '2024.01.24 09:33:38',
      amount: '-0.65688'
    }
  ])
  //获取首页NFT列表
  async function getHistoryRewards() {
    const result = await api.historyRewards();
    nfts.value = result.list;
  }
  //领取奖励
  async function receiveTiger() {
    const data = {
      from: walletStore.account,
      value: 0,
      contractAddress: walletStore.currentChainConfig.contracts.mainAddress,
      methodName: "receiveTiger",
      args: []
    }
    const result = await walletStore.contractCall(data)
    console.log('receiveTiger result:',{data,result})
    return result
  }

  return {
    rewards,
    rewardHistory,
    getHistoryRewards,
    receiveTiger
  }
})