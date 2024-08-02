<script setup>

import * as echarts from 'echarts'
import { onMounted, ref, onBeforeUnmount, shallowRef } from "vue";
const timeId = ref(Math.floor(new Date().getTime() * Math.random())); // 使该图表保持唯id

const props = defineProps({
    echartData: {
        type: Object,
        default: () => ({})
    }
})

const data = ref([])
const xData = ref([])
const defendData = ref([])
const attackData = ref([])

const currentIndex = ref(0);
const intervalId = ref(null);
const tooltipIntervalId = ref(null);
const tooltipIndex = ref(0);
const dataZoomConfig = ref({ start: 0, end: 4 });

const myCharts = shallowRef(null);
let chartsRef = ref(null)

const color = [new echarts.graphic.LinearGradient(
    0, 0, 0, 1, // 渐变方向
    [
        { offset: 1, color: 'rgba(0, 0, 0, 0)' },
        { offset: 0, color: '#0E7CE2' }
    ]
), new echarts.graphic.LinearGradient(
    0, 0, 0, 1, // 渐变方向
    [
        { offset: 1, color: 'rgba(0, 0, 0, 0)' },
        { offset: 0, color: '#FF8352' }
    ]
)]

/**
 * 初始化数据
 */
const initData = () => {
    const defend = props.echartData.defend || []
    const attack = props.echartData.attack || []
    console.log('defend :>> ', defend,props.echartData);
    xData.value = defend.map(item => {
        data.value.push(Math.random() * 100);
        return item.x
    })
    defendData.value = defend.map(item => item.y)
    attackData.value = attack.map(item => item.y)
}
/**
 * 初始化chart
 */
const initChart = () => {
    myCharts.value = echarts.init(chartsRef.value);
    const option = {
        legend: {
            show: true,
            icon: 'circle',
            top: '0%',
            right: 0,
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 25,
            textStyle: {
                color: '#ffffff',
                fontSize: 22
            }
        },
        grid: {
            top: '20%',
            left: '0%',
            right: '40',
            bottom: '0%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: [{
            type: 'category',
            data: xData.value,
            axisLine: {
                lineStyle: {
                    color: '#ddd'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                interval: 0,
                textStyle: {
                    color: '#ffffff',
                    fontSize: 16
                },
                margin: 15,
                formatter: function (value) {
                // 使用\n实现文本的换行
                return value.split(' ').join('\n');
            }
            },
            boundaryGap: false
        }],
        yAxis: [{
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#ffffff'
                }
            },
            axisLabel: {
                textStyle: {
                    color: '#ffffff',
                    fontSize: 22
                }
            },
            splitLine: {
                show: false
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: ["rgba(51, 86, 240, 0.15)", "rgba(250,250,250,0.15)"]
                }
            }
        }],
        // dataZoom: {
        //     show: false
        // },
        series: [{
            name: '攻击',
            type: 'line',
            data: attackData.value,
            symbolSize: 2,
            symbol: 'circle',
            showSymbol: false,
            smooth: true,
            lineStyle: {
                color: '#FF8352'
            },
            itemStyle: {
                color: '#FF8352',
                borderColor: '#FF8352'
            },
            areaStyle: {
                color: color[1]
            },
        }, {
            name: '防守',
            type: 'line',
            data: defendData.value,
            symbolSize: 2,
            symbol: 'circle',
            showSymbol: false,
            smooth: true,
            lineStyle: {
                color: '#0E7CE2'
            },
            itemStyle: {
                color: '#0E7CE2',
                borderColor: '#0E7CE2'
            },
            areaStyle: {
                color: color[0]
            }
        }
        ]
    };
    myCharts.value.setOption(option);
}

const updateData = () => {
  // 更新数据，实现循环滚动
  const firstX = xData.value.shift();
  data.value.shift();
  currentIndex.value++;
  xData.value.push(firstX + xData.value.length);
  data.value.push(Math.random() * 100);

  // 更新 dataZoom 组件
  const end = (dataZoomConfig.value.end + 4) % data.value.length;
  const start = end - data.value.length < 0 ? 0 : end - data.value.length;
  dataZoomConfig.value.start = start;
  dataZoomConfig.value.end = end;

  // 更新图表
  myCharts.value.setOption({
    xAxis: {
      data: xData.value,
    },
    series: [
      {
        data: attackData.value,
      },
      {
        data: defendData.value
      }
    ],
    dataZoom: [
      {
        start: dataZoomConfig.value.start,
        end: dataZoomConfig.value.end,
      },
    ],
  });
};

const startScrolling = () => {
  intervalId.value = setInterval(() => {
    updateData();
  }, 12000); // 每秒更新一次
};

const startTooltip = () => {
    tooltipIntervalId.value = setInterval(() => {
        // console.log(tooltipIndex.value);
        myCharts.value.dispatchAction({
            type: 'showTip',
            seriesIndex: 1,
            dataIndex: tooltipIndex.value,
        });
        tooltipIndex.value = (tooltipIndex.value + 1) % xData.value.length;
        if (tooltipIndex.value > xData.value.length) {
            tooltipIndex.value = 0;
        }
    }, 3000); // 每秒显示下一个 tooltip
};

onMounted(_ => {
    initData()
    initChart()
    // startScrolling();
    startTooltip();
})
onBeforeUnmount(() => {
  // 清除定时器
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  if (tooltipIntervalId.value) {
    clearInterval(tooltipIntervalId.value);
  }
});
</script>
<template>
    <div class="chart-container">
        <div :id="'echart' + timeId" class="interface-echart" ref="chartsRef"></div>
    </div>
</template>
<style scoped lang='scss'>
.chart-container {
    height: 100%;
    width: 100%;

    .interface-echart {
        width: 100%;
        height: 100%;
    }
}
</style>
