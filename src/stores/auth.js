import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as api from '../services/api'
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoggedIn = ref(false)
  //获取登录nonce值
  async function loginNonce(address) {
    const nonce = await api.loginNonce({address})
    return nonce;
  }
  //登录
  async function login(params) {
    const userInfo = await api.login(params)
    user.value = userInfo;
    isLoggedIn.value = true
    return userInfo
  }
  //用户信息
  async function userInfo() {
    const userInfo = await api.userInfo()
    user.value = userInfo;
    return userInfo
  }
  //退出登录
  function logout() {
    user.value = null
    isLoggedIn.value = false
  }

  return {
    user,
    isLoggedIn,
    loginNonce,
    login,
    userInfo,
    logout
  }
})