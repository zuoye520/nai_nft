import { createRouter, createWebHistory } from 'vue-router'
// Routes
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import NFTDetails from '../views/NFTDetails.vue'
import Profile from '../views/Profile.vue'
import Rewards from '../views/Rewards.vue'
import Refer from '../views/Refer.vue'
import Chart from '../views/Chart.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/nft/:id', component: NFTDetails },
    { path: '/profile', component: Profile },
    { path: '/rewards', component: Rewards },
    { path: '/refer', component: Refer },
    { path: '/chart', component: Chart }
  ]
})

export default router