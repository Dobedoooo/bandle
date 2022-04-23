<template>
	<div class="h-100p">
		<div class="container">
			<div class="left fl">
				<BasicInfo v-model:gameDetail="state.gameDetail"></BasicInfo>
			</div>
			<div class="right fr">
                <div class="head">
                    <div class="settings cur no-sel" @click="settings">⚙️</div>
                </div>
                <div class="content">
                    <GameDetails :game="state.gameDetail" v-model:loading="state.cover">
                        <img class="w-48 ver-mid" src="../../assets/images/icon/poro_happy_cheers_inventory.png">
                    </GameDetails>
                </div>
			</div>
            <SpringAnimation :on="settingsSwitch" type="down" :range="[0, 450]" @animationEnd="setReady" style="position: relative; z-index: 201;">
                <div class="settings-panel">
                    <SettingsPanel @close="coverOff"></SettingsPanel>
                </div>
            </SpringAnimation>
            <div class="no-sel fs-12 version" v-if="store.state.version">V{{ store.state.version }}</div>
		</div>
        <div class="cover" :style="coverStyle" @click="coverOff"></div>
	</div>
</template>

<script lang="ts">
import { ref, reactive, defineComponent, provide, inject, computed, onMounted, watchEffect, CSSProperties } from 'vue'

// vuex
import store from '../../store'

// component
import RingLoading from '../../components/RingLoading.vue'
import GameDetails from '../../components/GameDetails.vue'
import BasicInfo from '../../components/Basic.vue'
import SettingsPanel from '../../components/SettingsPanel.vue'
import SpringAnimation from '../../components/SpringAnimation.vue'

// api
import {
    getIcon,
    getLolMatchHistoryV3MatchlistAccountByAccountId,
    getLolRankedV1RankedStatsByPuuid,
    getLolSummonerV1CurrentSummoner
} from '../../api/api'

export default defineComponent({
	name: 'panoramic',
	components: {
        RingLoading,
        GameDetails,
        BasicInfo,
        SettingsPanel,
        SpringAnimation,
    },
	setup() {
        
		const state = reactive({
            gameDetail: {},
            cover: false,
            summoner: {} as any,					// 召唤师信息
			ranked: {},						// 排位信息
			macthData: {},					// 对局信息
			matchConfig: {
				begIndex: 0,
				endIndex: 10
			},
		})

        // 当前召唤师 不提交 mutation
		async function setSummoner() {
            try {
                state.summoner = await getLolSummonerV1CurrentSummoner(store.state.clientInfo)
            } catch(e) {
                console.error('请求召唤师信息时出错')
            }
		}
		// 对局
		async function setMatch() {
            try {
                state.macthData = await getLolMatchHistoryV3MatchlistAccountByAccountId(store.state.clientInfo, state.summoner.accountId, state.matchConfig)
                store.commit('setMatch', state.macthData)
            } catch(e) {
                console.error('请求比赛信息时出错')
            }
		}
		// 排位
		async function setRanked() {
            try {
                state.ranked = await getLolRankedV1RankedStatsByPuuid(store.state.clientInfo, state.summoner.puuid)
                store.commit('setRanked', state.ranked)
            } catch(e) {
                console.error('请求排位信息时出错')
            }
		}
		// 头像
		async function setProfileIcon() {
            getIcon(store.state.version, 'profileicon', state.summoner.profileIconId).then(buffer => {
                const url = URL.createObjectURL(new Blob([buffer]))
                state.summoner.profileIconUrl = url
                store.commit('setSummoner', state.summoner)
            }).catch(e => console.error('请求召唤师头像时出错'))
		}
        const inSomething: any = inject('busy')
		const idle: any = inject('idle')

        async function init() {
            try {
                inSomething()
                await setSummoner()
                await setMatch()
                await setRanked()
                await setProfileIcon()
                idle()
            } catch(e) {
                console.log(e);
                
            }
        }
        onMounted(init)

        const settingsSwitch = ref(false)
        const readyToClose = ref(false)
        const coverStyle = computed((): CSSProperties => {
            return {
                opacity: settingsSwitch.value ? '1' : '0',
                zIndex: settingsSwitch.value ? 200 : -1,
            }
        })
        const settings = () => {
            settingsSwitch.value = true
            readyToClose.value = false
        } 
        const coverOff = () => {
            if(readyToClose.value === false) return
            settingsSwitch.value = false
        }
        const setReady = () => readyToClose.value = true

		return { 
            state, 
            store, 
            settings, 
            settingsSwitch, 
            coverOff, 
            setReady, 
            readyToClose, 
            coverStyle,
            // panelClose
        }

	},
})
</script>

<style lang="scss" scoped>
.container {
    position: relative;
    width: 1120px;
    height: 650px;
    margin: auto;
    // display: flex;
    // justify-content: space-between;
    padding-top: 70px;
    .right {
        position: relative;
        width: 810px;
        border-radius: 20px;
        background-color: #fff;
        box-shadow: 0 10px 25px rgb(0 0 0 / 10%);
        .head {
            height: 40px;
            display: flex;
            justify-content: flex-end;
            .settings {
                width: 20px;
                height: 20px;
                margin: 15px 15px 0 0;
                transition: text-shadow .15s;
                &:hover  {
                    text-shadow: 0 0px 5px silver;
                }
            }
        }
        .content {
            height: 610px;
        }
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
    .version {
        position: absolute;
        bottom: -73px;
        right: -107px;
        color: rgba(0, 0, 0, .3);
    }
    .settings-panel {
        position: absolute;
        top: -487px;
        left: 185px;
    }
}
</style>