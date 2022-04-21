<template>
    <div style="display: none">
    </div>
</template>

<script lang="ts">
import { onMounted, reactive, watchEffect } from 'vue'

import store from '../store'

import { ipcRenderer } from 'electron'

import {
    accept
} from '../api/api'

export default {
    name: 'globalFunc',
    setup() {

        const state = reactive({
            eventCallback: {
                'OnJsonApiEvent_lol-summoner_v1_current-summoner': (): void => {},
                'OnJsonApiEvent_lol-matchmaking_v1_ready-check': (event: any, message: string): void => {
                    const msg = JSON.parse(message)
					if(msg.data === null) {
						return
					} else if(msg.data.playerResponse === 'None') {
						accept(store.state.clientInfo)
					}
                }
            }
        })

        watchEffect(() => {
            // webSocket 建立后，订阅默认事件
            if(store.state.wsState === '1') {
                store.state.defaultSubscribe.forEach((item: string) => {
                    if(store.state.subscribed.indexOf(item) !== -1) return
                    ipcRenderer.send('subscribe', item)
					store.commit('appendSubscribed', item)
                })
            }
        })

        function buildWebSocket() {
            // 获取到客户端信息后，通知主进程 建立 webSokcet
            if(store.state.clientInfo.port && store.state.clientInfo.auth) {
                ipcRenderer.send('buildWs', JSON.stringify(store.state.clientInfo))
            }
        }

        watchEffect(buildWebSocket)

        function init() {
            // 监听 “websocket以建立”事件
            ipcRenderer.on('built', () => store.commit('setWsState', '1'))
            // 监听默认事件
            store.state.defaultSubscribe.forEach((item: string) => {
                if(store.state.listend.indexOf(item) !== -1) return
                ipcRenderer.on(item, state.eventCallback[item as keyof typeof state.eventCallback])
                store.commit('appendListend', item)
            })
        }

        onMounted(init)

    }
}
</script>

<style lang="scss" scoped>

</style>