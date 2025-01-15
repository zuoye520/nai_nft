<template>
  <div>
    <button class="p-5" @click="selectedPeriod(5*60)">5min</button>
    <button class="p-5" @click="selectedPeriod(60*60)">1h</button>
    <button class="p-5" @click="selectedPeriod(60*60*24)">1d</button>
  </div>
  <div v-show="isChartVisible">
    <div ref="chartRef" style="width: 1000px; height: 500px;"></div>
  </div>
</template>

<script setup>
import { createChart } from 'lightweight-charts';
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';

const chartRef = ref(null); // 绑定 DOM 元素
const isChartVisible = ref(true); // 控制容器显示
let chart = null; // 保存图表实例
let candlestickSeries = null
const prices = ref([
        {
            "time": 1736596801737,
            "price": "1185185185"
        },
        {
            "time": 1736604360505,
            "price": "1500000000"
        },
        {
            "time": 1736604382604,
            "price": "1185185185"
        },
        {
            "time": 1736738636245,
            "price": "1500000000"
        },
        {
            "time": 1736768943976,
            "price": "1185185185"
        },
        {
            "time": 1736869509754,
            "price": "1500000000"
        },
        {
            "time": 1736869549863,
            "price": "10666666669"
        }
    ])
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
    candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4caf50', // 阳线颜色
      downColor: '#f44336', // 阴线颜色
      borderUpColor: '#4caf50',
      borderDownColor: '#f44336',
      wickUpColor: '#4caf50',
      wickDownColor: '#f44336',
    });
    
    generateCandlestickData(60);
    
  } else {
    console.error('chartRef is null!'); // 如果 chartRef 仍为 null
  }
});

onBeforeUnmount(() => {
  if (chart) {
    chart.remove(); // 销毁图表实例
  }
});


/**
 * 生成K线数据
 * @param interval 时间周期 1分钟/1小时/1天
 */
 const generateCandlestickData = (interval = 5*60) => {
  const rawData = prices.value.map((item) => ({
    time: Math.floor(item.time / 1000), // 转换为秒级时间戳
    price: Number(item.price/1e8), // 转换为数字类型
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
    console.log(index,'===>',item.price,{groupTime,currentGroup:currentGroup.time})
  });
  if (currentGroup) groupedData.push(currentGroup); // 添加最后一组

  console.log('groupedData:',groupedData)
  // 更新图表数据
  candlestickSeries.setData(groupedData);
};

const selectedPeriod = (interval) => {
  generateCandlestickData(interval); // 切换时间间隔时重新生成数据
};


</script>
