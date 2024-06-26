<template>
    <div class="custom-scroll">
        <vue3-seamless-scroll :list="scrollListArr" class="scroll" :step="step" :hover="hover" :direction="direction">
            <slot></slot>
        </vue3-seamless-scroll>
    </div>
</template>
<script setup>
import { Vue3SeamlessScroll } from "vue3-seamless-scroll";
import { ref, reactive } from "vue";

const props = defineProps({
    scrollListArr: {
        type: Array
    },
    // 滚动速度
    step: {
        type: Number,
        default: 0.1
    },
    // 鼠标悬浮是否滚动
    hover: {
        type: Boolean,
        default: false
    },
    // 滚动方向
    direction: {
        type: String,
        default: "up"
    }
})

</script>
<style lang="scss" scoped>
.custom-scroll {
    width: 100%;
    height: 100%;
    .scrollBox {
        border: 2px solid #f42600;
        padding: 6px 0;
        width: 300px;
        margin: 0 auto;
        height: 190px;
    }
    .scroll {
        height: 100%;
        overflow: hidden;
        line-height: 38px;
    }
}
</style>