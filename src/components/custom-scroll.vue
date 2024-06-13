<template>
    <div class="custom-scroll">
        <vue3-seamless-scroll :list="scrollListArr" class="scroll" :step="step" :hover="hover">
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
        default: 0.3
    },
    // 鼠标悬浮是否滚动
    hover: {
        type: Boolean,
        default: false
    }
})

</script>
<style lang="scss">
.scrollBox {
    border: 2px solid #f42600;
    padding: 6px 0;
    width: 300px;
    margin: 0 auto;
    height: 190px;
}
.scroll {
    height: 190px;
    overflow: hidden;
    line-height: 38px;
}
</style>