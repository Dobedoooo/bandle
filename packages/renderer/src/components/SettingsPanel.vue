<template>
    <div class="settings-container pd-20 no-sel" id="root" @animationend="end">
        <div class="fs-22">设置</div>
        <div>
            <span>自动接受对局</span>
            <Switch v-model:flag="busiState.autoAccept" :size="'medium'"></Switch>
        </div>
        <div>
            <span>召唤师信息监控</span>
            <!-- <Switch :size="'medium'"></Switch> -->
        </div>
        <div :class="['close', 'cur']" @click="emitClose">❌</div>
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
        flag: Boolean
    },
    setup(props, { emit }) {

        // 面板开关动画
        const state = reactive({ 
            root: document.getElementById('root'),
            openFlag: computed(() => props.flag),
            closable: false,
        })
        watchEffect(() => {
            // if(!state.openFlag && state.root) {
            //     state.root.style.transform = 'translate3d(0, 0, 0)'
            //     state.closable = false
            // }
        })
        function end() {
            // state.root = document.getElementById('root')
            // if(state.root) {
            //     console.log('end');
            //     state.root.style.animation = 'none'
            //     state.root.style.transform = 'translate3d(0, 440px, 0)'
            //     state.closable = true
            //     emit('readyToClose')
            //     console.log(state.root.style.animation = 'none');
                
            // }
        }
        const emitClose = () => emit('close', false)
       
        // 
        const busiState = reactive({
            autoAccept: false,
            summonerChange: false,
        })

        // function autoAcceptSwitch(flag: boolean) {  }
        function summonerSwitch(flag: boolean) { busiState.summonerChange = flag }
        
        onMounted(() => {
            // console.log(autoAcceptSwitch.value)
        })

        return { 
            props, 
            end, 
            state, 
            emitClose, 
            summonerSwitch,
            busiState,
            store,
        }

    }
})
</script>

<style lang="scss" scoped>

.settings-container {
    position: relative;
    width: 750px;
    height: 350px;
    box-sizing: border-box;
    background-color: rgba($color: #fff, $alpha: .5);
    backdrop-filter: saturate(250%) blur(25px);
    box-shadow: 0 0px 25px rgb(0 0 0 / 10%);
    border-radius: 10px;
    transition: transform .15s ease-in;
    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        transition: text-shadow .15s;
        &:hover {
            text-shadow: 0 0px 5px #c0392b;
        }
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