<script setup>
// import JSON_DATA from '/src/const/data.json'
import { onMounted, computed, ref } from 'vue';
import personChart from './components/personChart.vue'
import trendChart from './components/trendChart.vue'
import bubbleChart from './components/bubbleChart.vue'
import customScroll from './components/custom-scroll.vue'
// import './utils/bg.js'

let JSON_DATA = {}
const getData = () => {
  return new Promise((resolve, reject) => {
    fetch('http://114.132.204.164/data.json')
      .then(response => response.json())
      .then(data => {
        // 更新页面使用的数据
        console.log(data);
        JSON_DATA = data
        initData()
        resolve()
      })
      .catch(error => {
        console.error('Error fetching JSON:', error);
        reject(error)
      })

  })
}
// await getData()
const initData = () => {
  startTime.value = JSON_DATA.date[0]
  endTime.value = JSON_DATA.date[1]
  futureTime.value = new Date(endTime.value).getTime();
  scrollListArr.value = JSON_DATA.timeLine
  exerciseScale.value = JSON_DATA.scale
  attackTeamList.value = JSON_DATA.attackTeam
  defendTeamList.value = JSON_DATA.defendTeam
  trendChartData.value = JSON_DATA.trendData
  bubbleChartData.value = JSON_DATA.moreOffensive.chartData
}
console.log('datajson :>> ', JSON_DATA);
// 加载背景 js
function loadExternalScript() {
  const script = document.createElement('script');
  script.src = 'src/utils/bg.js';
  script.async = true;
  script.onload = () => {
    console.log('External script has been loaded!');
    // 在脚本加载完成后可以执行需要的操作
  };
  document.head.appendChild(script);
}

let showTime = ref('')

const startTime = ref('')
const endTime = ref('')
const futureTime = ref('');
const currentTime = ref(new Date().getTime());
// 格式化
const _formatNum = (num) => {
  return num < 10 ? '0' + num : num
}

// 大屏计时器
const getTime = () => {
  const nowDate = new Date()
  const date = nowDate.getFullYear() + '-' + _formatNum(nowDate.getMonth() + 1) + '-' + _formatNum(nowDate.getDate())
  const time = _formatNum(nowDate.getHours()) + ':' + _formatNum(nowDate.getMinutes()) + ':' + _formatNum(nowDate.getSeconds())
  let week = ''
  switch (nowDate.getDay()) {
    case 0:
      week = '星期天'
      break
    case 1:
      week = '星期一'
      break
    case 2:
      week = '星期二'
      break
    case 3:
      week = '星期三'
      break
    case 4:
      week = '星期四'
      break
    case 5:
      week = '星期五'
      break
    case 6:
      week = '星期六'
      break
    default:
      break
  }
  return {
    date,
    time,
    week
  }
}
// 设置大屏时间
const setTime = () => {
  const time = getTime()
  showTime.value = time.date + ' ' + time.time + ' ' + time.week
}
// 
const timeLeft = ref(futureTime.value - currentTime.value);
// 倒计时
const formattedTime = computed(() => {
  const days = Math.floor(timeLeft.value / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft.value % (1000 * 60)) / 1000);
  return `${days}天 ${_formatNum(hours)}:  ${_formatNum(minutes)}:  ${_formatNum(seconds)}`;
});

// 实施战况
const scrollListArr = ref([])

// 演习规模数据
const exerciseScale = ref({})

const attackTeamList = ref([]) // 攻击队伍
const defendTeamList = ref([]) // 防守队伍
const teamItem = ref(null)

const personChartData = computed(() => {
  if(!attackTeamList.value.length || !defendTeamList.value.length){
     return null
  }
  return [
    { name: '攻击队数量', value: attackTeamList.value.length },
    { name: '防御队数量', value: defendTeamList.value.length }
  ]
})


// 趋势图数据
const trendChartData = ref(null)

// 失险次数最多单位数据
const bubbleChartData = ref(null)

onMounted(async () => {
  await getData()
  console.log(bubbleChartData.value);
  loadExternalScript(); // 引入背景 js

  teamItem.value = document.querySelector('.team-item')
  timeLeft.value = futureTime.value - new Date().getTime();
  setTime()
  setInterval(() => {
    setTime()
    timeLeft.value = futureTime.value - new Date().getTime();
  }, 1000)
})

</script>

<template>
  <div class="page-body">
    <header id="header">
      <h3 class="header-title">实战演练 - 指挥调度</h3>
      <div class="showTime">{{ showTime }}</div>
    </header>

    <div id="container">
      <div id="flexCon">
        <div class="flex-row flex-1">
          <div class="flex-cell flex-cell-l">
            <div class="chart-wrapper top">
              <h3 class="chart-title">参赛人数</h3>
              <div class="chart-div chart-done chart-people">
                <person-chart v-if="personChartData" class="person-chart" :echartData="personChartData"></person-chart>
                <div class="person-list">
                  <div class="person-item" v-for="item in personChartData" :key="item.name">
                    <span>{{ item.name }}</span>
                    <div class="person-seprate"></div>
                    <span>{{ item.value }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="chart-wrapper flex-1">
              <h3 class="chart-title">演习规模</h3>
              <div class="chart-div chart-done exercise-scale flex flex-column">
                <div class="flex-1 flex">
                  <div class="scale-item flex-1 flex align-center">
                    <img src="./assets/attack.png" alt="attack">
                    <div class="scale-item__text">
                      <div class="scale-item__num">{{ exerciseScale.attack }}</div>
                      <div>攻击</div>
                    </div>
                  </div>
                  <div class="scale-item flex-1 flex align-center">
                    <img src="./assets/sector.png" alt="sector">
                    <div class="scale-item__text">
                      <div class="scale-item__num">{{ exerciseScale.sector }}</div>
                      <div>行业</div>
                    </div>
                  </div>
                </div>
                <div class="flex-1 flex">
                  <div class="scale-item flex-1 flex align-center">
                    <img src="./assets/referee.png" alt="referee">
                    <div class="scale-item__text">
                      <div class="scale-item__num">{{ exerciseScale.referee }}</div>
                      <div>裁判</div>
                    </div>
                  </div>
                  <div class="scale-item flex-1 flex align-center">
                    <img src="./assets/defend.png" alt="defend">
                    <div class="scale-item__text">
                      <div class="scale-item__num">{{ exerciseScale.defend }}</div>
                      <div>防守</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-cell flex-cell-c">
            <!-- <div class="chart-wrapper">
                <h3 class="chart-title"></h3>
                <div class="chart-div"></div>
              </div> -->
          </div>
          <div class="flex-cell flex-cell-r">
            <div class="chart-wrapper top">
              <h3 class="chart-title">演习周期倒计时</h3>
              <div class="chart-div chart-done">
                <div class="time-range">{{ startTime }} ~ {{ endTime }}</div>
                <div class="time-count-down">{{ formattedTime }}</div>
              </div>
            </div>
            <div class="chart-wrapper flex-1">
              <h3 class="chart-title">失陷次数最多单位</h3>
              <div class="chart-div chart-done">
                <bubble-chart v-if="bubbleChartData" :title="'失陷次数最多单位'" :echartData="bubbleChartData"></bubble-chart>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="flex-row">
            <div class="flex-cell flex-cell-l">
              
            </div>
            <div class="flex-cell flex-cell-c">
              <div class="chart-wrapper">
                <h3 class="chart-title"></h3>
                <div class="chart-div"></div>
              </div>
            </div>
            <div class="flex-cell flex-cell-r">
              
            </div>
          </div> -->
        <div class="flex-row bottom" style="height: 300px;">
          <div class="flex-cell flex-cell-l">
            <div class="chart-wrapper flex-1">
              <h3 class="chart-title">攻击队伍</h3>
              <div class="chart-div chart-done team-box">
                <div class="team-title team-border">
                  <span>队伍名称</span>
                  <span>得分</span>
                </div>
                <div class="scroll-box">
                  <custom-scroll :scrollListArr="attackTeamList">
                    <div class="team-item team-border" v-for="(item, index) in attackTeamList" :key="item.id">
                      <div class="team-info">
                        <img :src="item.img" alt="">
                        <span> {{ item.name }}</span>
                      </div>
                      <div class="score">{{ item.score }}</div>
                    </div>
                  </custom-scroll>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-row flex-5">
            <div class="flex-cell flex-cell-c">
              <div class="chart-wrapper flex-1">
                <h3 class="chart-title">得分趋势</h3>
                <div class="chart-div chart-done">
                  <trend-chart v-if="trendChartData" class="trend-chart" :echartData="trendChartData"></trend-chart>
                </div>
              </div>
            </div>
            <div class="flex-cell flex-cell-c">
              <div class="chart-wrapper flex-1">
                <h3 class="chart-title">实时战况</h3>
                <div class="chart-div chart-done">
                  <custom-scroll :scrollListArr="scrollListArr" direction="down">
                    <div class="real-time-item" v-for="(item, index) in scrollListArr" :key="item.id">
                      <div>
                        <div class="time">{{ item.time }}</div>
                        <div class="name">{{ item.name }}</div>
                      </div>
                      <div class="success">成功</div>
                    </div>
                  </custom-scroll>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-cell flex-cell-r">
            <div class="chart-wrapper flex-1">
              <h3 class="chart-title">防守队伍</h3>
              <div class="chart-div chart-done team-box">
                <div class="team-title team-border">
                  <span>队伍名称</span>
                  <span>得分</span>
                </div>
                <div class="scroll-box">
                  <custom-scroll :scrollListArr="defendTeamList">
                    <div class="team-item team-border" v-for="(item, index) in defendTeamList" :key="item.id">
                      <div class="team-info">
                        <img :src="item.img" alt="">
                        <span> {{ item.name }}</span>
                      </div>
                      <div class="score">{{ item.score }}</div>
                    </div>
                  </custom-scroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <canvas id="canvas"></canvas> 

    </div>
</template>

<style scoped lang="scss">
#canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.flex-5{
  flex: 5;
}

.showTime {
  position: absolute;
  top: 10px;
  right: 40px;
  font-size: 28px;
  color: #FFFFFF;
}

.time-range {
  font-family: 'tapeworm';
  color: #FFFFFF;
  font-size: 23px;
  padding: 20px;
  text-align: center;
  text-shadow: 0px 0px 20px rgba(255, 255, 255, 1);
}

.time-count-down {
  font-family: 'ds-digit';
  font-size: 32px;
  text-align: center;
  color: #FFFFFF;
}

.top {
  height: 200px;
  margin-bottom: 4px;
}

.exercise-scale {
  img {
    width: 100px;
    height: 100px;
  }

  .scale-item {
    justify-content: space-around;
    &__text {
      color: #FFFFFF;
      font-size: 18px;
      margin-right: 20px;
      text-align: center
    }

    &__num {
      font-weight: bold;
      margin-bottom: 10px;
    }
  }
}

.chart-people {
  display: flex;
  align-items: center;

  .person-chart {
    width: 36%;
    margin-right: 20px;
  }

  .person-list {
    flex: 1;
    color: #FFFFFF;

    .person-item {
      font-size: 18px;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        margin-right: 8px;
        display: inline-block;
        border-left: 16px solid #0E7CE2;
        /* 左边框 */
        border-top: 10px solid transparent;
        /* 右边框 */
        border-bottom: 10px solid transparent;
        /* 底部边框 */
      }

      &:not(:last-child) {
        margin-bottom: 20px;

        &::before {
          border-left-color: #FF8352;
        }
      }

      .person-seprate {
        margin: 0 16px;
        width: 12%;
        height: 2px;
        border-radius: 2px;
        background: #FFFFFF
      }
    }
  }
}

.team-box {
  color: #FFFFFF;
  display: flex;
  flex-direction: column;

  .team-title {
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    color: #2c40af;
  }

  .scroll-box {
    flex: 1;
    overflow: hidden;
  }

  .team-item {
    font-size: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;

    .team-info {
      display: flex;
      align-items: center;
    }

    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
    .score {
      color: rgb(59, 153, 94);
    }
  }
    
  .team-border {
    border-bottom: 1px solid #FFFFFF;
  }
}

.real-time-item{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  font-size: 20px;
  color: #FFFFFF;
  border-bottom: 1px solid #FFFFFF;
  .time{
    color: rgb(65, 103, 164);
  }
  .success{
    color: rgb(59, 153, 94);
    text-shadow: 0 0 20px rgb(114, 255, 166);
  }
}

#header, #container {
  // display: none;
}

.page-body {
  height: 100%;
  position: relative;
  font-family: "Microsoft Yahei", Arial, sans-serif;
  background: #050d3c url("./assets/bg.png") 0 0 / 100% 100% no-repeat;
}

.flex-1 {
  -webkit-flex: 1;
  -ms-flex: 1;
  flex: 1;
}

/* layout */
#header {
  position: relative;
  height: 120px;
  background: url("./assets/header.png") 0 0 / 100% 100% no-repeat;
  overflow: hidden;
  z-index: 1;
}

.header-title {
  line-height: 120px;
  text-align: center;
  font-size: 32px;
  font-weight: 400;
  color: #bef2ff;
}

#container {
  position: absolute;
  top: 64px;
  bottom: 15px;
  left: 0;
  right: 0;
  z-index: 1;
}

#flexCon {
  height: 100%;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}

.flex-row {

  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
}

.flex-cell {
  /* -webkit-flex: 1;
	-ms-flex: 1;
	flex: 1; */
  display: flex;
  flex-direction: column;
  /* width: 420px; */
  padding: 2px;
}

.flex-cell-l,
.flex-cell-r {
  /* -webkit-flex: 2;
  -ms-flex: 2;*/
  flex: 2;
}

.flex-cell-c {
  /* -webkit-flex: 3;
	-ms-flex: 3; */
  flex: 3;
}


.chart-wrapper {
  position: relative;
  /* height: 100%;
  flex: 1; */
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, .6);
  border-style: solid;
  overflow: hidden;
  border-width: 6px 10px 10px;
  border-image: url("./assets/chart-wrapper.png") 26 27 27 fill / 1 / 0 repeat;
}

.chart-title {
  /* height: 30px; */
  font-size: 20px;
  padding: 4px 0;
  font-weight: normal;
  color: #FFFFFF;
  text-align: center;
  background: radial-gradient(circle at center, rgba(51, 86, 240, 0.79), rgba(0, 0, 0, .1));
  ;
}

.chart-div {
  flex: 1;
  overflow: hidden;
  /* position: absolute;
	top: 30px;
	bottom: 0;
	left: 0;
	right: 0; */
}

/* media query */

/* chart-loader */
.chart-loader {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0);
  transition: all .8s;
}

.chart-loader .loader {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  border: 3px solid transparent;
  border-top-color: #3498db;
  border-radius: 50% !important;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;
}

.chart-loader .loader:before {
  content: "";
  position: absolute;
  top: 3px;
  left: 5px;
  right: 5px;
  bottom: 5px;
  border: 3px solid transparent;
  border-top-color: #e74c3c;
  border-radius: 50% !important;
  -webkit-animation: spin 3s linear infinite;
  animation: spin 3s linear infinite;
}

.chart-loader .loader:after {
  content: "";
  position: absolute;
  top: 9px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  border: 3px solid transparent;
  border-top-color: #f9c922;
  border-radius: 50% !important;
  -webkit-animation: spin 1.5s linear infinite;
  animation: spin 1.5s linear infinite;
}

.chart-done .chart-loader {
  display: none;
}

@-webkit-keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg)
  }
}

@keyframes spin {
  0% {
    -webkit-transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    transform: rotate(0deg)
  }

  100% {
    -webkit-transform: rotate(360deg);
    -ms-transform: rotate(360deg);
    transform: rotate(360deg)
  }
}
</style>
