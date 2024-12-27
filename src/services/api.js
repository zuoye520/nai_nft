
import { sendRequest } from '../utils/httpUtils'
import { PinataSDK } from "pinata-web3";

import { BINANCE_URL,IPFS_CONFIG } from '../config'
const pinata = new PinataSDK({
  pinataJwt: IPFS_CONFIG.jwt,
  pinataGateway: IPFS_CONFIG.gateway,
});
/**
 * 币安获取币种平均价格
 * @param {*} symbol 
 * @returns 
 */
export const nulsUsd = async (symbol= 'NULSUSDT')=>{
  try {
    // 构建 API 请求 URL
    const url = `${BINANCE_URL}/api/v3/avgPrice?symbol=${symbol}`;
    // 发送 GET 请求获取热门列表
    const response = await sendRequest(url, { method: 'get' });
    
    if(!response.price) throw response
    console.log('nulsUsd:',response.price)
    return response.price;
  } catch (error) {
    // 捕获并记录任何发生的错误
    console.error('nulsUsd:', error);
    return 0;
  }
}
/**
 * 上传json到ipfs
 * @param {*} data 
 * @returns 
 */
export const uploadJson = async (data)=>{
  const upload = await pinata.upload.json(data)
  return upload;
}

/**
 * 上传文件到ipfs
 * @param {*} file 
 * @returns 
 */
export const uploadFile = async (file)=>{
  const upload = await pinata.upload.file(file)
  return upload;
}
/**
 * 上传文件到ipfs
 * @param {*} file 
 * @returns 
 */
export const getFile = async (hash)=>{
  const data = await pinata.gateways.get(hash);
  return data 
}
