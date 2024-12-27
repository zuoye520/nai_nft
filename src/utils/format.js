/**
 * 格式化工具函数
 * src/utils/format.js
 */

/**
 * 添加精度 - 将普通数字转换为链上精度
 * @param {number|string} amount 原始数量
 * @returns {string} 添加精度后的数量
 * 例如: 1.5 => "150000000"
 */
export const toAmount = (amount,decimals = 8) => {
  if (!amount) return '0'
  
  try {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0'
    
    return (num * Math.pow(10, decimals)).toString()
  } catch (err) {
    console.error('金额转换错误:', err)
    return '0'
  }
}

/**
 * 去除精度 - 将链上数据转换为显示数字
 * @param {number|string} amount 链上数量
 * @returns {string} 去除精度后的数量
 * 例如: "150000000" => "1.5"
 */
export const fromAmount = (amount,decimals = 8) => {
  if (!amount) return '0'
  
  try {
    const num = parseFloat(amount)
    if (isNaN(num)) return '0'
    
    return (num /  Math.pow(10, decimals)).toString()
  } catch (err) {
    console.error('金额转换错误:', err)
    return '0'
  }
}

/**
 * 格式化金额
 * @param {number|string} amount 金额
 * @param {number} decimals 小数位数
 * @param {string} symbol 货币符号
 * @returns {string} 格式化后的金额
 */
export const formatAmount = (amount, decimals = 8, symbol = '') => {
  if (!amount) return '0.00'
  
  // 转换为数字
  const num = parseFloat(amount)
  if (isNaN(num)) return '0.00'
  
  // 格式化数字
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  
  return symbol ? `${symbol} ${formatted}` : formatted
}

/**
 * 格式化 NULS 金额
 * @param {number|string} amount NULS 金额
 * @returns {string} 格式化后的 NULS 金额
 */
export const formatNuls = (amount,decimals=8) => {
  // 如果是链上数据,先去除精度
  const value = amount.length > decimals ? fromAmount(amount) : amount
  return formatAmount(value, decimals, 'NULS')
}

/**
 * 格式化美元金额
 * @param {number|string} amount 美元金额
 * @returns {string} 格式化后的美元金额
 */
export const formatUsd = (amount) => {
  return formatAmount(amount, 2, '$')
}

/**
 * 缩写大数字
 * @param {number|string} num 数字
 * @returns {string} 缩写后的数字
 */
export const formatLargeNumber = (num) => {
  if (!num) return '0'
  
  const n = parseFloat(num)
  if (isNaN(n)) return '0'
  
  if (n >= 1e9) {
    return (n / 1e9).toFixed(2) + 'B'
  }
  if (n >= 1e6) {
    return (n / 1e6).toFixed(2) + 'M'
  }
  if (n >= 1e3) {
    return (n / 1e3).toFixed(2) + 'K'
  }
  
  return n.toString()
}
