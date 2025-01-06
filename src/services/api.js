
import { sendRequest } from '../utils/httpUtils'
import { PinataSDK } from "pinata-web3";

import { API_URL,BINANCE_URL,IPFS_CONFIG } from '../config'
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
    const url = `${BINANCE_URL}/api/v3/avgPrice?symbol=${symbol}`;
    const response = await sendRequest(url, { method: 'get' });
    if(!response.price) throw response
    console.log('nulsUsd:',response.price)
    return response.price;
  } catch (error) {
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



/**
 * NFT API -- 获取nonce
 * @param {*} params 
 * @returns 
 */
export const loginNonce = async (params= {})=>{
  const  data = {
    "address": params.address,
  }
  const url = `${API_URL}/login/nonce`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('loginNonce result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- 登录
 * @param {*} params 
 * @returns 
 */
export const login = async (params= {})=>{
  const  data = params;
  const url = `${API_URL}/login`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('login result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 列表
 * @param {*} params 
 * @returns 
 */
export const nftList = async (params= {})=>{
  const  data = {
    "pageNum": 0,
    "pageSize": 10,
    "keyword": "",
    "projectState": "Mint",
    "orderBy": "ASC"
  }
  const url = `${API_URL}/nft/list`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftList result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 持有列表
 * @param {*} params 
 * @returns 
 */
export const nftHeldList = async (params= {})=>{
  const  data = {
    "pageNum": 0,
    "pageSize": 10,
  }
  const url = `${API_URL}/user/nft/held`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftHeldList result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 创建列表
 * @param {*} params 
 * @returns 
 */
export const nftCreatedList = async (params= {})=>{
  const  data = {
    "pageNum": 0,
    "pageSize": 10,
  }
  const url = `${API_URL}/user/nft/created`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftCreatedList result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- 老虎机奖励记录
 * @param {*} params 
 * @returns 
 */
export const historyRewards = async (params= {})=>{
  const  data = {
    "pageNum": 0,
    "pageSize": 10,
  }
  const url = `${API_URL}/user/reward`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('historyRewards result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- 邀请奖励记录
 * @param {*} params 
 * @returns 
 */
export const historyRefers = async (params= {})=>{
  const  data = {
    "pageNum": 0,
    "pageSize": 10,
  }
  const url = `${API_URL}/user/refer`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('historyRefers result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}
