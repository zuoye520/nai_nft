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
import { useNftStore } from '../../../stores/nft'
const nftStore = useNftStore()

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
let intervalId = null
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

const initData = ()=>{
   //定时获取价格数据
  intervalId = setInterval(() => {
    nftStore.getNftPrice(props.nft.id)
  }, 10000);//10秒执行一次
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
      if (chart && chartRef.value) {
        chart.applyOptions({
          width: chartRef.value.offsetWidth
        })
      }
    })
    resizeObserver.observe(chartRef.value)
    //定时获取数据
    initData()
  }
})

// 获取时间间隔键值
const getIntervalKey = () => {
  switch (selectedPeriod.value) {
    case '5min':
      return 5*60
    case '1h':
      return 60*60
    case '1d':
      return 60*60*24
  }
}
/**
 * 生成K线数据
 * @param interval 时间周期 1分钟/1小时/1天
 */
 const generateCandlestickData = () => {
  const interval = getIntervalKey()
  const rawData = props.prices.map((item) => ({
    time: Math.floor(item.time / 1000), // 转换为秒级时间戳
    price: Number(item.price), // 转换为数字类型
  }));

  // 按时间间隔分组
  const groupedData = [];
  let currentGroup = null;

  rawData.forEach((item,index) => {
    const groupTime = Math.floor(item.time / interval) * interval; // 按时间分组
    
    if (!currentGroup || currentGroup.time !== groupTime) {
      if (currentGroup) groupedData.push(currentGroup);
      currentGroup = {
        time: groupTime,
        open: item.price,
        high: item.price,
        low: item.price,
        close: item.price,
        price:item.price
      };
    } else {
      currentGroup.high = Math.max(currentGroup.high, item.price);
      currentGroup.low = Math.min(currentGroup.low, item.price);
      currentGroup.close = item.price;
    }
  });
  if (currentGroup) groupedData.push(currentGroup); // 添加最后一组

  return groupedData;
};

// 更新图表数据
const updateChartData = () => {
  const data = generateCandlestickData()
  candlestickSeries.setData(data)
}
// 监听周期变化
watch(selectedPeriod, () => {
  updateChartData()
})
// 监听价格数据变化
watch(() => props.prices, () => {
  // console.log('watch prices:',props.prices)
  updateChartData()
}, { deep: true })

onBeforeUnmount(() => {
  if (chart) {
    chart.remove()
  }
  if(intervalId){
    clearInterval(intervalId);
  }
  
})

</script>