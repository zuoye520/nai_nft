<template>
  <div class="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
    <div class="flex justify-between items-center mb-6">
      <div class="space-y-1">
        <h3 class="text-xl font-semibold text-white">Price Chart</h3>
        <p class="text-sm text-gray-400">Last {{ selectedPeriod }} trading history</p>
      </div>
      <div class="flex space-x-2">
        <button 
          v-for="period in periods" 
          :key="period"
          @click="selectedPeriod = period"
          class="px-3 py-1 rounded-lg text-sm"
          :class="[
            selectedPeriod === period
              ? 'bg-green-500/20 text-green-400'
              : 'text-gray-400 hover:text-gray-300'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>
    
    <div class="flex justify-center text-gray-400 relative">
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
      <div ref="tooltipRef" class="absolute hidden pointer-events-none z-50 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-lg shadow-lg p-3 text-sm"></div>
    </div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';
import { fromAmount } from '../../../utils/format';

const props = defineProps({
  nft: {
    type: Object,
    required: true
  },
  prices: {
    type: Array,
    required: true
  }
})

const periods = ['5min', '1h', '1d']
const selectedPeriod = ref('5min')
const chartRef = ref(null)
const tooltipRef = ref(null)
let chart = null
let candlestickSeries = null

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${month}-${day} ${hours}:${minutes}`
}

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(4)
}

// 创建工具提示HTML
const createTooltipHTML = (data) => {
  return `
    <div class="space-y-1">
      <div class="text-gray-400">Time: ${formatTime(data.time)}</div>
      <div class="text-green-400">Open: ${formatPrice(data.open)} NULS</div>
      <div class="text-blue-400">High: ${formatPrice(data.high)} NULS</div>
      <div class="text-red-400">Low: ${formatPrice(data.low)} NULS</div>
      <div class="text-${data.close >= data.open ? 'green' : 'red'}-400">
        Close: ${formatPrice(data.close)} NULS
      </div>
    </div>
  `
}

// 生成连续的价格数据
const generateContinuousPrices = (basePrice, count, volatility = 0.02) => {
  const prices = []
  let currentPrice = basePrice
  let trend = 0 // 趋势因子

  for (let i = 0; i < count; i++) {
    const random = Math.random()  //Math.random() 
    // 更新趋势因子
    trend = trend * 0.7 + (random - 0.5) * 0.3
    
    // 基于趋势计算价格变化
    const change = (random - 0.5 + trend) * volatility
    currentPrice = currentPrice * (1 + change)

    // 确保价格不会过分偏离基准价格
    const maxDeviation = basePrice * 0.2 // 最大允许偏离20%
    if (Math.abs(currentPrice - basePrice) > maxDeviation) {
      currentPrice = basePrice + (Math.sign(currentPrice - basePrice) * maxDeviation)
    }

    prices.push(currentPrice)
  }

  return prices
}

// 聚合数据函数
const aggregateData = (rawData, period) => {
  if (!rawData || rawData.length === 0) return []
  
  const intervals = new Map()
  const sortedData = [...rawData].sort((a, b) => a.time - b.time)
  let lastClose = null

  sortedData.forEach((item, index) => {
    const key = getIntervalKey(item.time, period)
    const basePrice = Number(item.price)

    if (!intervals.has(key)) {
      // 生成这个时间段内的连续价格
      const priceCount = 5 // 每个时间段内的价格点数
      const continuousPrices = generateContinuousPrices(
        lastClose || basePrice,
        priceCount,
        0.01 // 降低波动率使曲线更平滑
      )

      const open = continuousPrices[0]
      const close = continuousPrices[continuousPrices.length - 1]
      const high = Math.max(...continuousPrices)
      const low = Math.min(...continuousPrices)

      intervals.set(key, {
        time: Math.floor(item.time / 1000),
        open,
        high,
        low,
        close
      })

      lastClose = close
    }
  })
  
  return Array.from(intervals.values())
}

// 获取时间间隔键值
const getIntervalKey = (timestamp, period) => {
  const seconds = Math.floor(timestamp / 1000)
  switch (period) {
    case '5min':
      return Math.floor(seconds / 300) * 300
    case '1h':
      return Math.floor(seconds / 3600) * 3600
    case '1d':
      return Math.floor(seconds / 86400) * 86400
    default:
      return seconds
  }
}

onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    // 创建图表
    chart = createChart(chartRef.value, {
      width: chartRef.value.offsetWidth,
      height: 400,
      layout: {
        background: { type: 'solid', color: '#000000' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2c2f36' },
        horzLines: { color: '#2c2f36' },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: '#2c2f36',
          style: 0,
          labelBackgroundColor: '#2c2f36',
        },
        horzLine: {
          width: 1,
          color: '#2c2f36',
          style: 0,
          labelBackgroundColor: '#2c2f36',
        }
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#2c2f36',
      },
      rightPriceScale: {
        borderColor: '#2c2f36',
      },
    })

    // 创建K线图系列
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50',
      downColor: '#f44336',
      borderUpColor: '#4caf50',
      borderDownColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    })

    // 添加工具提示
    chart.subscribeCrosshairMove(param => {
      if (!param.time || param.point.x < 0 || param.point.y < 0) {
        tooltipRef.value.style.display = 'none'
        return
      }

      const data = param.seriesData.get(candlestickSeries)
      if (data) {
        tooltipRef.value.style.display = 'block'
        
        const chartRect = chartRef.value.getBoundingClientRect()
        const tooltipWidth = 200
        
        let left = param.point.x + 15
        if (left + tooltipWidth > chartRect.width) {
          left = param.point.x - tooltipWidth - 15
        }
        
        tooltipRef.value.style.left = `${left}px`
        tooltipRef.value.style.top = `${param.point.y}px`
        tooltipRef.value.innerHTML = createTooltipHTML(data)
      }
    })

    // 初始化数据
    updateChartData()

    // 响应式调整
    const resizeObserver = new ResizeObserver(() => {
      if (chart) {
        chart.applyOptions({
          width: chartRef.value.offsetWidth
        })
      }
    })
    resizeObserver.observe(chartRef.value)
  }
})

// 更新图表数据
const updateChartData = () => {
  if (candlestickSeries) {
    const aggregatedData = aggregateData(props.prices, selectedPeriod.value)
    candlestickSeries.setData(aggregatedData)
  }
}

// 监听周期变化
watch(selectedPeriod, () => {
  updateChartData()
})

// 监听价格数据变化
watch(() => props.prices, () => {
  updateChartData()
}, { deep: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.remove()
  }
})
</script>