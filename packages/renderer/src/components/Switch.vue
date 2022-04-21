<template>
    <div class="">
        <div class="switch-box" :class="{'active': props.active}" @click="activate()">
            <div class="switch-btn"></div>
            <div class="line"></div>
            <div class="circle"></div>
        </div>
    </div>
    <!-- TODO 禁用状态 -->
</template>

<script>
import { ref } from 'vue'
export default {
    props: {
        active: { type: Boolean }
    },
    setup(props, { emit }) {

        // const active = ref(false)

        function activate() {
            // active.value = !active.value
            emit('active', !props.active)
            console.log(`active ${!props.active}`);
        }

        return {
            activate, props
        }
    },
}
</script>
<style scoped lang="scss">
.switch-box {
    width: 54px;
    height: 30px;
    background-color: #d7d9dd;
    border-radius: 15px;
    border: 1px solid #d6d6dd;
    position: relative;
    display: inline-block;
    cursor: pointer;
    transition: all .15s ease-out;
    .switch-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 1px solid #cacacd;
        background-color: #fff;
        transition: all .35s cubic-bezier(0.35, 0.66, 0, 1.25);
        box-shadow: 0 1px 3px rgba($color: #000000, $alpha: .44);
        position: absolute;
        z-index: 10;
    }
    &.active {
        background-color: #22c73b;
        border-color: #1cc435;
        .switch-btn {
            transform: translateX(24px);
            border-color: #48b355;
        }
    }
    .line {
        width: 1px;
        height: 12px;
        background-color: #fff;
        position: absolute;
        top: 8px;
        left: 14px;
        border-radius: 1px;
    }
    .circle {
        width: 10px;
        height: 10px;
        background-color: transparent;
        border: 1px solid #a8a8af;
        position: absolute;
        border-radius: 50%;
        top: 9px;
        right: 9px;
    }
}
</style>