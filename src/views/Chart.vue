<template>
  <div v-show="isChartVisible">
    <div ref="chartRef"  style="width: 800px; height: 500px;"></div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';

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
        background: { type: 'solid', color: '#1e1e1e' }, // 深色背景
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
const data = generateCandlestickData('2023-01-01', 30);
console.log(data);
    
    candlestickSeries.setData(data);
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



</script>
