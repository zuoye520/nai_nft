
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
    // const url = `${BINANCE_URL}/api/v3/avgPrice?symbol=${symbol}`;
    const url =`https://assets.nabox.io/api/price/NULS`
    const response = await sendRequest(url, { method: 'get' });
    if(!response) throw response
    // console.log('nulsUsd:',response)
    return response;
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
 * 读取文件
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
 * NFT API -- 用户信息
 * @returns 
 */
export const userInfo = async ()=>{
 const data ={}
  const url = `${API_URL}/user/info`;
  const response = await sendRequest(url, {
    data, 
    method: 'post'
  });
  console.log('userInfo result:',{data,response})
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
    address:params.address,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 16,
  }
  if(params.nftId >= 0 ) data.nftId = params.nftId
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
    address:params.address,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 16,
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
  const data = {
    address:params.address,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
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
    address:params.address,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
  }
  const url = `${API_URL}/user/refer`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('historyRefers result:',{data,response})
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
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 16,
    keyword: params.keyword || "",//关键词搜索
    projectState: params.projectState || "",//Mint / Swap
    orderBy: params.orderBy || "DESC", // ASC / DESC
  }
  const url = `${API_URL}/nft/list`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftList result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 详情
 * @param {*} id 
 * @returns 
 */
export const nftInfo = async (id)=>{
  const  data = {id}
  const url = `${API_URL}/nft/info`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftInfo result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT Txn
 * @param {*} id 
 * @returns 
 */
export const nftTxn = async (params = {})=>{
  const  data = {
    id:params.id,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
  }
  const url = `${API_URL}/nft/txn`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftTxn result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT Price
 * @param {*} id 
 * @returns 
 */
export const nftPrice = async (id)=>{
  const  data = {
    id:id,
  }
  const url = `${API_URL}/nft/price`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftPrice result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 持有者列表
 * @param {*} id 
 * @returns 
 */
export const nftHolders = async (id)=>{
  const  data = {id}
  const url = `${API_URL}/nft/holders`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftHolders result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 回复列表
 * @param {*} id 
 * @returns 
 */
export const nftReplyList = async (params= {})=>{
  const  data = {
    id:params.id,
    pageNum: params.pageNum || 1,
    pageSize: params.pageSize || 10,
  }
  const url = `${API_URL}/nft/reply/list`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftReplyList result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

/**
 * NFT API -- NFT 回复
 * @param {*} id 
 * @returns 
 */
export const nftReply = async (params= {})=>{
  const  data = {
    nftId:params.id,
    content:params.content,
  }
  const url = `${API_URL}/nft/reply`;
  const response = await sendRequest(url, { data, method: 'post' });
  console.log('nftReply result:',{data,response})
  if(!response || response.code !=0) throw response
  return response.data;
}

export const mockPrice = async ()=>{
  const data = {}
  const url = `https://api.tiptag.social/community/getTokenTradeData?tick=Slime&isNew=true`;
  const response = await sendRequest(url, { data, method: 'get' });
  // console.log('mockPrice result:',{data,response})
  return response;
}