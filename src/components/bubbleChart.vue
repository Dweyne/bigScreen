<script setup>

import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
const timeId = ref(Math.floor(new Date().getTime() * Math.random())); // 使该图表保持唯id

const props = defineProps({
    echartData: {
        type: Array,
        default: () => []
    },
    title: {
        type: String,
        default: ''
    }
})

let myCharts = null;
let chartsRef = ref(null)

// const chartdata = [
//     { name: '东方不败', sum: 208, size: 100 },
//     { name: '红鼻子小黑', sum: 80, size: 60 },
//     { name: '王德发', sum: 108, size: 70 },
//     { name: '钢铁侠', sum: 80, size: 80 },
//     { name: '蜘蛛侠', sum: 108, size: 90 }
// ]
var color = ['#6DFFA1', '#56C7F6', '#F9F08A', '#6DFFA1', '#56C7F6', '#F9F08A'];
const data = ref([])

const getData = _ => {
    // console.log(echartData);
    const chartData = props.echartData.sort((a, b) => a.sum - b.sum)
    let startSize = 80
    chartData.map((item, index) => {
        if(item.sum !== chartData[index-1]?.sum){
            startSize += 10
        }
        data.value.push(
            {
                name: item.name + '\n' + item.sum,
                value: 111,
                symbolSize: startSize,
                draggable: true,
                label: {
                    normal: {
                        textStyle: {
                            fontSize: 22,
                            color: '#fff',
                        },
                    },
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                            {
                                offset: 0.2,
                                color: 'rgba(27, 54, 72, 0.2)',
                            },
                            {
                                offset: 0.8,
                                color: color[index%7],
                            },
                        ]),
                        opacity: 1,
                        borderWidth: 1,
                        // borderColor: color[index],
                        borderColor: '#0E7CE2',
                        shadowBlur: 7,
                        symbolOffset: 0.6,
                        // shadowColor: color[index],
                        shadowColor: '#0E7CE2',
                    },
                },
            },
        )
    })
}


/**
 * 初始化数据
 */
let initData = () => {
    myCharts = echarts.init(chartsRef.value);
    const option = {
        // backgroundColor: '#16222E',
        animationDurationUpdate: function (idx) {
            return idx * 100;
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params, ticket, callback) {
                return params.data.tips || params.name;
            },
        },
        animationEasingUpdate: 'bounceIn',
        itemStyle: {
            // color: 'red',
        },
        cursor: 'pointer',
        series: [
            {
                type: 'graph',
                layout: 'force',
                cursor: 'pointer',
                force: {
                    repulsion: 200,
                    edgeLength: 100,
                },
                roam: true,
                label: {
                    show: true,
                },
                data: data.value,
            },
        ],
    };

    myCharts.setOption(option);
}


onMounted(_ => {
    // console.log(props.echartData);
    getData()
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
    background: url('../assets/bottom1.png') 0 100% / 100% 60% no-repeat;
    .interface-echart {
        width: 100%;
        height: 100%;
    }
}
</style>
