<script setup>

import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
const timeId = ref(Math.floor(new Date().getTime() * Math.random())); // 使该图表保持唯id

const props = defineProps({
    xData: {
        type: Array,
        default: () => []
    },
    defendData: {
        type: Array,
        default: () => []
    },
    attackData: {
        type: Array,
        default: () => []
    }
})

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
let initData = () => {
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
            right: '20',
            bottom: '0%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: [{
            type: 'category',
            data: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
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
            data: [5, 12, 11, 4, 25, 16, 1],
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
            data: [13, 10, 3, 12, 15, 30, 7],
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
