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
    
    <div class="h-96 flex justify-center text-gray-400">
      <div ref="chartRef"  style="width: 100%; height: 500px;"></div>
    </div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
import { ref, onMounted, nextTick, onBeforeUnmount,computed } from 'vue';
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


const chartRef = ref(null); // 绑定 DOM 元素
const isChartVisible = ref(true); // 控制容器显示
let chart = null; // 保存图表实例

onMounted(async () => {
  await nextTick(); // 确保 DOM 完全渲染
  if (chartRef.value) {
    chart = createChart(chartRef.value, {
      width: chartRef.value.offsetWidth,
      height: 500,
      layout: {
        background: { type: 'solid', color: '#000000' }, // 深色背景
        textColor: '#d1d4dc', // 文本颜色
      },
      grid: {
        vertLines: {
          color: '#2c2f36', // 垂直网格线颜色
        },
        horzLines: {
          color: '#2c2f36', // 水平网格线颜色
        },
      },
      crosshair: {
        mode: 0, // 设置光标交互样式
      },
    });
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50', // 阳线颜色
      downColor: '#f44336', // 阴线颜色
      borderUpColor: '#4caf50',
      borderDownColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });
    // 生成 30 天的 K 线数据，从 2023-01-01 开始
    const klineData = generateCandlestickData('2023-01-01', 30);
    // const klineData = aggregateData(props.prices,'5min')
    // console.log('klineData:',klineData)
    candlestickSeries.setData(klineData);
  } else {
    console.error('chartRef is null!'); // 如果 chartRef 仍为 null
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.remove(); // 销毁图表实例
  }
});

function generateCandlestickData(startDate, days) {
  const data = [];
  let lastClose = 1.0; // 初始收盘价
  const date = new Date(startDate);

  for (let i = 0; i < days; i++) {
    const open = lastClose;
    const high = +(open + Math.random() * 0.2).toFixed(2); // 随机高价
    const low = +(open - Math.random() * 0.2).toFixed(2);  // 随机低价
    const close = +(low + Math.random() * (high - low)).toFixed(2); // 随机收盘价

    data.push({
      time: date.toISOString().split('T')[0], // 转换为 YYYY-MM-DD 格式
      open,
      high,
      low,
      close,
    });

    // 更新日期和最后的收盘价
    lastClose = close;
    date.setDate(date.getDate() + 1);
  }

  return data;
}

// 函数：将Unix时间戳转换为格式化日期（年-月-日T时:分:秒）
function convertTimestampToDate(timestamp, interval) {
    const date = new Date(timestamp * 1000);  // 转换为毫秒
    let key;
    if (interval === '5min') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${String(date.getHours()).padStart(2, '0')}:${Math.floor(date.getMinutes() / 5) * 5}:00`;
    } else if (interval === '1h') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${String(date.getHours()).padStart(2, '0')}:00:00`;
    } else if (interval === '1d') {
        key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
    return key;
}

// 函数：重新组装数据
function aggregateData(rawData, interval) {
    let result = [];
    let currentInterval = '';
    let intervalData = [];

    for (let i = 0; i < rawData.length; i++) {
        const item = rawData[i];
        const intervalKey = convertTimestampToDate(item.time, interval);

        if (intervalKey !== currentInterval) {
            if (intervalData.length > 0) {
                // 处理当前时间段数据
                const open = intervalData[0].price;
                const high = Math.max(...intervalData.map(d => d.price));
                const low = Math.min(...intervalData.map(d => d.price));
                const close = intervalData[intervalData.length - 1].price;

                result.push({
                    time: item.time,
                    open: open,
                    high: high,
                    low: low,
                    close: close,
                });
            }

            // 开始新的时间段
            currentInterval = intervalKey;
            intervalData = [item];
        } else {
            intervalData.push(item);
        }
    }

    // 处理最后一个时间段
    if (intervalData.length > 0) {
        const open = intervalData[0].price;
        const high = Math.max(...intervalData.map(d => d.price));
        const low = Math.min(...intervalData.map(d => d.price));
        const close = intervalData[intervalData.length - 1].price;

        result.push({
            time: currentInterval,
            open: open,
            high: high,
            low: low,
            close: close,
        });
    }

    return result;
}

</script>