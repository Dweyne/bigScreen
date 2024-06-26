<script setup>

import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
const timeId = ref(Math.floor(new Date().getTime() * Math.random())); // 使该图表保持唯id

const props = defineProps({
    echartData: {
        type: Object,
        default: () => ({})
    }
})

const xData = ref([])
const defendData = ref([])
const attackData = ref([])

let myCharts = null;
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
    xData.value = defend.map(item => item.x)
    defendData.value = defend.map(item => item.y)
    attackData.value = attack.map(item => item.y)
}
/**
 * 初始化chart
 */
const initChart = () => {
    myCharts = echarts.init(chartsRef.value);
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
                    fontSize: 22
                },
                margin: 15
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

    myCharts.setOption(option);
}


onMounted(_ => {
    initData()
    initChart()
})
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
