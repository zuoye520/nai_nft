import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '../services/api'
import { useWalletStore } from './wallet';
import {fromAmount,formatUsd} from '../utils/format'
export const useRewardsStore = defineStore('rewards', () => {
  const walletStore = useWalletStore();
  //可领取的奖励
  const rewards = ref(0)
  // rewardHistory Mock
  const rewardHistoryTotal = ref(0)
  const rewardHistory = ref([
    {
      type: 'Mint Lucky Bonus',
      date: '2024.01.26 10:44:07',
      amount: '+0.00606',
      luckyBonus:'+0.00606'
    },
    {
      type: 'Swap Lucky Bonus',
      date: '2024.01.25 14:55:14',
      amount: '+0.00369',
      luckyBonus:'+0.00606'
    },
    {
      type: 'Withdrawal',
      date: '2024.01.24 09:33:38',
      amount: '-0.65688',
      luckyBonus:'0'
    }
  ])
  //获取历史奖励记录
  async function getHistoryRewards(params) {
    const result = await api.historyRewards(params);
    const list = result.list.map((item)=>{
      item.type = item.txType == 'Withdrawal'? item.txType:`${item.txType} Lucky Bonus`
      item.date = item.createdDate
      // item.amount = item.txType == 'Withdrawal' ? `-${fromAmount(item.amount)}` : `+${fromAmount(item.amount)}`
      item.luckyBonus = item.txType == 'Withdrawal' ? `-${fromAmount(item.luckyBonus)}` : `+${fromAmount(item.luckyBonus)}`
      return item
    })
    rewardHistoryTotal.value = result.totalCount
    rewardHistory.value = list;
  }
  //查询奖励
  async function getRewards(userAddress) {
    const data = {
      contractAddress: walletStore.currentChainConfig.contracts.mainAddress,
      methodName: "userDomains",
      args: [userAddress || walletStore.account]
    }
    let result = await walletStore.invokeView(data)
    console.log('userDomains result:',{data,result})
    result = JSON.parse(result.result)
    rewards.value = fromAmount(result.pending)
    return 
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
    rewardHistoryTotal,
    rewardHistory,
    getRewards,
    getHistoryRewards,
    receiveTiger
  }
})