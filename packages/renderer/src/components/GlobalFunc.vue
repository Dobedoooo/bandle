<template>
    <div style="display: none">
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watchEffect } from 'vue'

import store from '../store'

import { ipcRenderer } from 'electron'

import {
    accept
} from '../api/api'

export default defineComponent({
    name: 'globalFunc',
    props: {
        readyToConnect: { require: true, type: Boolean }
    },
    setup(props) {

        // 默认订阅事件触发后所执行函数
        const summonerChangeCallback = (event: any, message: string) => console.log(JSON.parse(message))
        // 默认订阅事件触发后所执行函数
        const matchReadyCheckCallback = (event: any, message: string) => {
            const msg = JSON.parse(message)
            if(msg.data === null) {
                return
            } else if(msg.data.playerResponse === 'None') {
                accept(store.state.clientInfo).then(data => {
                    store.commit('appendWebSocketInfo', 'OnJsonApiEvent_lol-matchmaking_v1_ready-check: 对局已接受')
                })
            }
        }
        const eventCallback = {
            'OnJsonApiEvent_lol-summoner_v1_current-summoner': summonerChangeCallback,
            'OnJsonApiEvent_lol-matchmaking_v1_ready-check': matchReadyCheckCallback
        }

        watchEffect(buildWebSocket)
        async function buildWebSocket() {
            // 获取到客户端信息后，通知主进程 建立 webSokcet
            if(props.readyToConnect) {
                store.commit('appendWebSocketInfo', '正在建立与英雄联盟客户端的连接...')
                ipcRenderer.send('buildWs', JSON.stringify(store.state.clientInfo))
            }
        }

        function init() {
            // 监听 “websocket已建立”事件
            ipcRenderer.on('built', () => {
                store.commit('appendWebSocketInfo', '连接建立完成')
                store.commit('setWsState', '1')
                // 订阅默认事件
                store.state.defaultSubscribe.forEach(async(item: string) => {
                    if(store.state.subscribed.indexOf(item) !== -1) return
                    const response = await ipcRenderer.invoke('subscribe', item)
                    if(typeof response === 'string') {
                        store.commit('appendWebSocketInfo', `${response} 已订阅`)
                        ipcRenderer.on(item, eventCallback[item as keyof typeof eventCallback])
                        store.commit('appendWebSocketInfo', `${response} 已监听`)
                        store.commit('appendListend', item)
                        store.commit('appendSubscribed', item)
                    }
                })
            })

        }

        onMounted(init)

    }
})
</script>

<style lang="scss" scoped>

</style>