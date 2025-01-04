import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './index.css'
import './styles/global.css' // 添加新的全局样式

import * as config from './config'
import * as format from './utils/format'
import copy from 'copy-to-clipboard';

const app = createApp(App)
// 全局配置
app.config.globalProperties.$config = config
app.config.globalProperties.$format = format
app.config.globalProperties.$copy = copy

app.use(createPinia())
app.use(router)
app.mount('#app')