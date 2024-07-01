<script setup>

import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
const timeId = ref(Math.floor(new Date().getTime() * Math.random())); // 使该图表保持唯id

const props = defineProps({
    echartData: {
        type: Array
    }
})

let myCharts = null;
let chartsRef = ref(null)

const color = [
        new echarts.graphic.LinearGradient(
        0, 0, 0, 1, // 渐变方向
        [
            { offset: 1, color: 'rgba(255, 255, 255, 0.3)' },
            { offset: 0, color: '#FF8352' }
        ]
        ),
        new echarts.graphic.LinearGradient(
          0, 0, 0, 1, // 渐变方向
          [
            { offset: 0, color: 'rgba(255, 255, 255, 0.3)' },
            { offset: 1, color: '#0E7CE2' }
          ]
        )
    ]

let formatNumber = function(num) {
    let reg = /(?=(\B)(\d{3})+$)/g;
    return num.toString().replace(reg, ',');
}
let total = props.echartData.reduce((a, b) => {
    return a + b.value * 1
}, 0);
/**
 * 初始化数据
 */
let initData = () => {
    myCharts = echarts.init(chartsRef.value);
    const option = {
        // backgroundColor: bgColor,
        color: color,
        // tooltip: {
        //     trigger: 'item'
        // },
        title: [{
            text: '{name|总人数}\n{val|' + formatNumber(total) + '}',
            top: 'center',
            left: 'center',
            textStyle: {
                rich: {
                    name: {
                        fontSize: 22,
                        fontWeight: 'normal',
                        color: '#ffffff',
                        padding: [10, 0]
                    },
                    val: {
                        fontSize: 28,
                        fontWeight: 'bold',
                        color: '#ffffff',
                    }
                }
            }
        }],
        series: [{
            type: 'pie',
            radius: ['70%', '80%'],
            center: ['50%', '50%'],
            data: props.echartData,
            hoverAnimation: false,
            itemStyle: {
                // borderColor: bgColor,
                borderWidth: 2,
                borderRadius: 20
            },
            label: {
                show: false,
            },
        }]
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
