import { createRouter, createWebHistory } from 'vue-router'
// Routes
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import NFTDetails from '../views/NFTDetails.vue'
import Profile from '../views/Profile.vue'
import Rewards from '../views/Rewards.vue'
import Refer from '../views/Refer.vue'
import HowItWorks from '../views/HowItWorks.vue'
import Chart from '../views/Chart.vue'
import ConnectAI from '../views/ConnectAI.vue'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 总是滚动到顶部
    return { top: 0 };
  },
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/nft/:id', component: NFTDetails },
    { path: '/profile/:address', component: Profile },
    { path: '/rewards/:address', component: Rewards },
    { path: '/refer/:address', component: Refer },
    { path: '/how-it-works', component: HowItWorks },
    { path: '/chart', component: Chart },
    { path: '/connect-ai', component: ConnectAI }
  ]
})

export default router