<template>
	<div class="container">
		<div class="icon">
			<img src="../../assets/images/LoL_icon.png" draggable="false">
		</div>
		<div class="mgb-20 color-darkgold loading-txt">
			<span :class="{'color-pumpkin': state.loading[state.sysStatus].err}">{{ state.loading[state.sysStatus].text }}</span>
			<span v-if="state.loading[state.sysStatus].err" class="cur retry" @click="reload()">👉<span class="txt-hover-dec">再试一次</span></span>
		</div>
		<div class="loading-bar">
			<BarLoading :width="300" borderColor="#666" :color="['#005a82', '#6bc8d2']" :process="state.processNum"></BarLoading>
		</div>
		<GlobalFunc></GlobalFunc>
	</div>
</template>

<script lang="ts">
import { reactive, onMounted, computed, defineComponent, watchEffect, inject } from 'vue'
import { useRouter } from 'vue-router'

// components
import BarLoading from '../../components/BarLoading.vue'
import GlobalFunc from '../../components/GlobalFunc.vue'

// store
import store from '../../store'

// utils
import { lcu, getPortAndAuth, isGameOn, unique } from '../../utils/utils'

// api
import { 
	getCurrentVersion,
	getSprite,
	getPerks,
	getJson,
	accept
} from '../../api/api'

import { ipcRenderer } from 'electron';

export default defineComponent({
	name: 'index',
	components: {
		BarLoading,
		GlobalFunc
	},
	setup() {

		const router = useRouter()

		const state: any = reactive({
			currentVersion: '',
			clientInfo: {
				port: '',
				auth: '',
				err: ''
			},
			sysStatus: 'init',
			loading: {
				'init': { err: false, text: '初始化' },
				'inProcess': { err: false, text: '💬 加载中...' },
				'ready': { err: false, text: '就绪' },
				'err': { err: true, text: '意料之外的错误' },
				'no-game': { err: true, text: '并没有检测到客户端' }
			},
			process: {						// 进度依赖项
				connect: false,
				champJson: false,
				summonerJson: false,
				perks: false,
				items: false
			},
			processNum: computed(() => {	// 进度
				let tmpNum = 0
				let tmpArr = Object.entries(state.process)
				for(const [key, value] of tmpArr) {
					value && tmpNum++
				}
				return tmpNum / tmpArr.length * 100
			}),
			defaultSubscribe: [
				'OnJsonApiEvent_lol-summoner_v1_current-summoner',
				'OnJsonApiEvent_lol-matchmaking_v1_ready-check'
			] as string []
		})

		// 重试
		const reload: any = inject('reload')

		const inSomething: any = inject('busy')
		const idle: any = inject('idle')
		const nothing = () => {
			state.sysStatus = 'ready'
			idle()
		}

		// 进度控制
		function processControl(which: string) {
			state.process[which] = true
		}
		// 发生错误
		function error(type: string) {
			state.sysStatus = type
			idle()
		}
		// 回滚 process
		function rollBack() {
			for(let e in state.process) {
				state.process[e] = false
			}
		}
		// 写入版本信息
		async function setVersion() {
			state.currentVersion = (await getCurrentVersion() as string[])[0];
			store.commit('setVersion', state.currentVersion)

		}
		// 检测游戏进程
		async function detectGame() {
			// 进程正在运行则设系统状态为 inProcess，否则设为 no-game
			await isGameOn().then(flag => {
				if(flag) {
					state.sysStatus = 'inProcess'
				} else {
					error('no-game')
				}
			})
		}
		// 端口port 和 口令auth
		async function setClientInfo() {
			if(state.sysStatus !== 'inProcess') return
			await getPortAndAuth().then((data: any): void => {
				if(data.err) {
					error('no-game')
					
				} else {
					state.clientInfo = data
					store.commit('setClientInfo', state.clientInfo)
					processControl('connect')
				}
			})
		}
				
		interface Map {
			[id: string]: { name: string, sprite: string, x: number, y: number }
		}
        interface IUniversal { [key: string]: any }
		// champion.json
		async function setChampionJson() {
			if(state.sysStatus !== 'inProcess') return
			let champImageArray: string[] = []
			let champSprite: IUniversal = {}
			
			await getJson(state.currentVersion, 'champion').then((json: any) => {
				store.commit('setChampionJson', json.data)
				// 记录要请求的图片名称
				champImageArray = json.requiredSprite

				let champMap: Map = {}
				const data = json.data
				for(const key in data) {
					const value = data[key]
					champMap[value.key] = { name: value.name, sprite: value.image.sprite, x: value.image.x, y: value.image.y }
					
				}
				
				store.commit('setChampionMap', champMap)

			})
			for(const element of champImageArray) {
				await getSprite(state.currentVersion, element).then(buffer => {
					const url = URL.createObjectURL(new Blob([buffer]))
					champSprite[element] = url
				})

			}
			store.commit('setChampionSprite', champSprite)
			processControl('champJson')
		}
		// summoner.json
		async function setSummonerJson() {
			if(state.sysStatus !== 'inProcess') return
			let spellSprite: IUniversal = {}
			let spellArray: string[] = []
			await getJson(state.currentVersion, 'summoner').then((json: any) => {
				store.commit('setSummonerJson', json.data)
				spellArray = json.requiredSprite

				let spellMap: Map = {}
				const data = json.data
				for(const key in data) {
					const value = data[key]
					spellMap[value.key] = { name: value.name, sprite: value.image.sprite, x: value.image.x, y: value.image.y }

				}
				store.commit('setSummonerMap', spellMap)

			})
			for(const element of spellArray) {
				const buffer = await getSprite(state.currentVersion, element)
				const url = URL.createObjectURL(new Blob([buffer]))
				spellSprite[element] = url
			}
			store.commit('setSummonerSprite', spellSprite)
			processControl('summonerJson')
		}
		// 装备
		interface Item {
			name: string
			description: string
			plaintext: string
			image: Image
		}
		interface Items {
			[index: string]: Item
		}
		interface Image {
			sprite: string
			x: number
			y: number
		}
		async function setItems() {
			if(state.sysStatus !== 'inProcess') return
			let spriteImg: string[] = []
			const itemSprite: IUniversal = {}
			await getJson(state.currentVersion, 'item').then((json: any) => {
				spriteImg = json.requiredSprite
				const data: Items = {}
				const items: IUniversal = json.data
				for(const item in items) {
					data[item] = { 
						name: items[item].name, 
						description: items[item].description, 
						plaintext: items[item].plaintext,
						image: {
							sprite: items[item].image.sprite,
							x: items[item].image.x,
							y: items[item].image.y
						},
					}
				}
				store.commit('setItems', data)
			})
			for(let element of spriteImg) {
				const buffer = await getSprite(state.currentVersion, element)
				const url = URL.createObjectURL(new Blob([buffer]))
				itemSprite[element] = url
			}
			store.commit('setItemsSprite', itemSprite)
			processControl('items')
			
		}
		interface Perks {
			[id:string]: string
		}
		// 符文
		async function setPerks() {
			if(state.sysStatus !== 'inProcess') return
			const perksArray: object[] = await getPerks(state.clientInfo) as object[];
			const perks: Perks = {}
			perksArray.forEach((value: any) => {
				perks[value.id] = value.iconPath
			})
			store.commit('setPerks', perks)
			processControl('perks')
		}
		onMounted(async() => {
			// return
			try {

				inSomething()
				await detectGame()
				await setClientInfo()
				await setVersion()
				setItems()
				setPerks()
				setChampionJson()
				setSummonerJson()
	
			} catch(e) {
				rollBack()
				error('err')
			}

		})

		watchEffect(() => {
			if(state.processNum === 100) {
				nothing()
				// return
				setTimeout(() => {
					router.push({ name: 'panoramic'})
				}, 800)
			}
		})

		return { state, reload }

	},
	
})	
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	user-select: none;
	.icon {
		width: 240px;
		margin-bottom: 20px;
		img {
			width: 100%;
		}
	}
	.status-txt {

		margin-bottom: 20px;
	}
	.loading-bar {
		margin-bottom: 100px;
		
	}
	.loading-txt {
		.retry {
			margin-left: 10px;
		}
	}
}
</style>