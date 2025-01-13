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
    
    <div class="flex justify-center text-gray-400">
      <div ref="chartRef" style="width: 100%; height: 400px;"></div>
    </div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
import { ref, onMounted, nextTick, onBeforeUnmount, watch } from 'vue';

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
let chart = null
let candlestickSeries = null

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString()
}

// 格式化价格
const formatPrice = (price) => {
  return Number(price).toFixed(8)
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
        mode: 1, // 十字线模式
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
      // 添加工具提示
      localization: {
        timeFormatter: (time) => formatTime(time),
        priceFormatter: (price) => formatPrice(price),
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
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
    chart.subscribeCrosshairMove((param) => {
      if (param.time) {
        const data = param.seriesData.get(candlestickSeries)
        if (data) {
          const tooltip = `
            Time: ${formatTime(param.time)}
            Open: ${formatPrice(data.open)}
            High: ${formatPrice(data.high)}
            Low: ${formatPrice(data.low)}
            Close: ${formatPrice(data.close)}
          `
          // 可以在这里更新自定义的工具提示UI
          console.log(tooltip)
        }
      }
    })

    // 初始化数据
    updateChartData()
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

// 聚合数据函数
const aggregateData = (rawData, period) => {
  if (!rawData || rawData.length === 0) return []
  
  const intervals = new Map()
  
  rawData.forEach(item => {
    const key = getIntervalKey(item.time, period)
    if (!intervals.has(key)) {
      intervals.set(key, {
        prices: [Number(item.price)],
        time: Number(item.time)
      })
    } else {
      intervals.get(key).prices.push(Number(item.price))
    }
  })
  
  return Array.from(intervals.values()).map(interval => {
    const prices = interval.prices
    return {
      time: interval.time,
      open: Number(prices[0]),
      high: Number(Math.max(...prices)),
      low: Number(Math.min(...prices)),
      close: Number(prices[prices.length - 1])
    }
  })
}

// 获取时间间隔键值
const getIntervalKey = (timestamp, period) => {
  const date = new Date(timestamp * 1000)
  switch (period) {
    case '5min':
      return Math.floor(timestamp / 300) * 300
    case '1h':
      return Math.floor(timestamp / 3600) * 3600
    case '1d':
      return Math.floor(timestamp / 86400) * 86400
    default:
      return timestamp
  }
}
</script>