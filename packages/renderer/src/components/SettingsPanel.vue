<template>
    <div class="settings-container" :style="{
        animation: props.switch ? '1s linear 0s 1 normal forwards running panelDown' : 'none',
    }" id="root" @animationend="end()">
        <div>
            <span>自动接受对局</span>
            <Switch :active="state.autoAcceptSwitch"></Switch>
        </div>
        <div class="close cur" @click="emitClose()">❌</div>
        <div class="bottom-line"></div>
    </div>
</template>

<script lang="ts">
import { ref, defineComponent, reactive, computed, watchEffect, onMounted } from "vue";

import Switch from './Switch.vue'

import store from '../store'

export default defineComponent({
    name: 'settingsPanel',
    components: {
        Switch
    },
    props: {
        switch: { default: false, type: Boolean }
    },
    setup(props, { emit }) {

        const state = reactive({
            root: document.getElementById('root'),
            autoAcceptSwitch: false
        })

        watchEffect(() => {
            if(!props.switch && state.root) {
                state.root.style.transform = 'translate3d(0, 0, 0)'
                state.root.style.transition = 'transform .15s ease-in'
            }
        })

        function end() {
            state.root = document.getElementById('root')
            if(state.root) {
                state.root.style.animation = 'none'
                state.root.style.transform = 'translate3d(0, 440px, 0)'
            }
        }

        function emitClose() {
            emit('update:switch', false)
        }
        
        onMounted(() => {})

        return { props, end, state, emitClose }
    }
})
</script>

<style lang="scss" scoped>

.settings-container {
    position: absolute;
    width: 750px;
    height: 350px;
    top: -420px;
    left: 185px;
    z-index: 201;
    background-color: rgba(255, 255, 255, .3);
    backdrop-filter: saturate(250%) blur(25px);
    box-shadow: 0 10px 25px rgb(0 0 0 / 10%);
    border-radius: 10px;
    .close {
        position: absolute;
        top: 0px;
        right: 0px;
    }
    .bottom-line {
        width: 100%;
        height: 4px;
        position: absolute;
        bottom: 6px;
        &::before {
            display: block;
            content: "";
            width: 200px;
            height: 100%;
            background-color: #333;
            border-radius: 3px;
            cursor: pointer;
            margin: auto;
        }
    }
}
</style>