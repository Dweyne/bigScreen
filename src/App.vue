<script setup>
import JSON_DATA from './const/data.json'
import { onMounted, computed, ref } from 'vue';
import SeamlessScroll from "seamless-scroll-v3";
import personChart from './components/personChart.vue'

let showTime = ref('')

const startTime = JSON_DATA.date[0]
const endTime = JSON_DATA.date[1]
const futureTime = new Date(endTime).getTime();
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
const timeLeft = ref(futureTime - currentTime.value);
// 倒计时
const formattedTime = computed(() => {
  const days = Math.floor(timeLeft.value / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft.value % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft.value % (1000 * 60)) / 1000);
  return `${days}天 ${_formatNum(hours)}:  ${_formatNum(minutes)}:  ${_formatNum(seconds)}`;
});

const attackTeamList = ref(JSON_DATA.attackTeam) // 攻击队伍
const defendTeamList = ref(JSON_DATA.defendTeam) // 防守队伍
const teamItem = ref(null)
const classOption = ref({
    direction: "top",
    step: 1,
    singleHeight: 68,
    limitMoveNum: 3,
    waitTime: 3000,
    hoverStop: false
  });

const personChartData = computed(() => {
  return [
    { name: '攻击队参与人数', value: attackTeamList.value.length },
    { name: '防御队参与人数', value: defendTeamList.value.length }
  ]
})

onMounted(() => {
  teamItem.value = document.querySelector('.team-item')
  setTime()
  setInterval(() => {
    setTime()
    timeLeft.value = futureTime - new Date().getTime();
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
                <person-chart class="person-chart" :echartData="personChartData"></person-chart>
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
              <div class="chart-div chart-done">
                <div class="chart-loader">
                  <div class="loader"></div>
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
                <div class="chart-loader">
                  <div class="loader"></div>
                </div>
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
                  <SeamlessScroll ref="scrollRef" :data="attackTeamList" :class-option="classOption" class="warp">
                  <div class="team-item team-border" v-for="(item, index) in attackTeamList" :key="item.id">
                    <div class="team-info">
                      <img :src="item.img" alt="">
                      <span> {{ item.name }}</span>
                    </div>
                    <div>{{ item.score }}</div>
                  </div>
                </SeamlessScroll>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-row flex-cell-c">
            <div class="flex-cell flex-cell-c">
              <div class="chart-wrapper flex-1">
                <h3 class="chart-title">得分趋势</h3>
                <div class="chart-div chart-done">
                  <div class="chart-loader">
                    <div class="loader"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex-cell flex-cell-c">
              <div class="chart-wrapper flex-1">
                <h3 class="chart-title">实时战况</h3>
                <div class="chart-div chart-done">
                  <div class="chart-loader">
                    <div class="loader"></div>
                  </div>
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
                  <SeamlessScroll ref="scrollRef" :data="defendTeamList" :class-option="classOption" class="warp">
                  <div class="team-item team-border" v-for="(item, index) in defendTeamList" :key="item.id">
                    <div class="team-info">
                      <img :src="item.img" alt="">
                      <span> {{ item.name }}</span>
                    </div>
                    <div>{{ item.score }}</div>
                  </div>
                </SeamlessScroll>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  .scroll-box{
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
    .team-info{
      display: flex;
      align-items: center;
    }
    img{
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

  .team-border {
    border-bottom: 1px solid #FFFFFF;
  }
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
  width: 420px;
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
