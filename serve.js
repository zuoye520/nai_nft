// server.js
import serve from 'serve';

const server = serve('dist', {
  port: 3002,
  single: true,  // 可选：只托管一个 index.html
});

console.log("Serving pumpNFT at http://localhost:3002");
