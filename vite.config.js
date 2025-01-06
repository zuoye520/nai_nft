import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://nainft.yfmh.vip', // 目标后端服务器地址
        changeOrigin: true, // 修改请求头中的 Origin
        secure: false, // 如果后端是 https 并有自签名证书，设置为 false
        rewrite: (path) => path.replace(/^\/api/, ''), // 去掉前缀 /api
      },
    },
  },
});
