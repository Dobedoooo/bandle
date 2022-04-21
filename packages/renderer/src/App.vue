<template>
	<div class="w-100p h-100p main-container">
		<div class="restart cur" @click="restart()">📦</div>
		<div class="title-bar">
			<TitleBar></TitleBar>
		</div>
		<div class="loading">
			<Loading v-if="loadingFlag"/>
		</div>
		<div class="cover" :style="{
			opacity: store.state.settingsSwitch ? '1' : '0',
			zIndex: store.state.settingsSwitch ? '200' : '-1',
			// backdropFilter: `blur(${store.state.settingsSwitch ? 2 : 0}px)`
		}" @click="coverOff()"></div>
		<router-view v-if="isRouterAlive"/>
	</div>
</template>

<script lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { defineComponent, nextTick, provide, reactive, ref } from "vue";
import { ipcRenderer } from 'electron'
import { useRouter } from "vue-router";
import store from './store'

import TitleBar from './components/TitleBar.vue'
import Loading from './components/Loading.vue'

export default defineComponent({
	components: {
		TitleBar, Loading
	},
	setup() {
		
		// 刷新页面
		const isRouterAlive = ref(true)
		function reload() {
			isRouterAlive.value = false
			nextTick(() => {
				isRouterAlive.value = true
			})
		}
		provide('reload', reload)

		// 通知主进程最小化
		provide('minimize', () => ipcRenderer.send('minimize'))

		// 通知主进程关闭应用
		provide('close', () => ipcRenderer.send('close'))

		// loading 显示开关
		const loadingFlag = ref(false)
		provide('busy', () => loadingFlag.value = true)
		provide('idle', () => loadingFlag.value = false)
		
		// 重载
		const router  = useRouter()
		function restart() {
			router.push({ name: 'index' })
		}

		// 禁用刷新
		document.onkeydown = e => e.key == 'r' ? false : true

		// 遮罩开关
		const coverOff = () => {
			return
			store.commit('setSettingsSwitch', false)
		}

		return { isRouterAlive, loadingFlag, restart, coverOff, store }
	}
})
</script>

<style lang="scss">
@import './styles/index.scss';
@import 'reset-css';
#app {
	position: relative;
	font-family: PingFang Bold;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	width: 1350px;
	height: 800px;
	background-color: rgba($color: #f2f1f6, $alpha: 1);
	box-shadow: 0px 3px 6px rgb(0 0 0 / 10%);
	border-radius: 10px;
	overflow: hidden;
	padding-top: 38px;
	// overflow: hidden;
	::selection {
		background-color: #e17055;
		color: #fff;
	}
}
.title-bar {
	position: absolute;
	top: 0;
	z-index: 9998;
	backdrop-filter: blur(5px);
}
.loading {
	position: absolute;
	z-index: 9999;
	right: 8px;
	top: 10px;
}
.restart {
	position: absolute;
	top: 50px;
}
.main-container {
	.cover {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		margin-top: 38px;
		background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, .3));
		transition: all .25s linear;
		border-radius: 10px;
	}
}
</style>
