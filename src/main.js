import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './index.css'
import './styles/global.css' // 添加新的全局样式

// Routes
import Home from './views/Home.vue'
import Create from './views/Create.vue'
import NFTDetails from './views/NFTDetails.vue'
import Profile from './views/Profile.vue'
import Rewards from './views/Rewards.vue'
import Refer from './views/Refer.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/create', component: Create },
    { path: '/nft/:id', component: NFTDetails },
    { path: '/profile', component: Profile },
    { path: '/rewards', component: Rewards },
    { path: '/refer', component: Refer }
  ]
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')