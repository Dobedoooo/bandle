<template>
    <div class="basic-info-container">
        <div class="summoner-info" v-if="state.summoner">
            <div class="summoner-avatar">
                <RingLoading :width="5" color="#0694a6" :percentage="state.summoner.percentCompleteForNextLevel" :internalDiameter="98">
                    <img class="no-sel" :src="state.summoner.profileIconUrl" draggable="false">
                </RingLoading>
            </div>
            <div class="summoner-level">
                {{ state.summoner.summonerLevel }}
            </div>
            <div class="summoner-name fs-18">
                <span>{{ state.summoner.displayName }}</span>
                <img class="ranked-img no-sel" :src="state.rankedIcon" :title="state.ranked.highestRankedEntry.tier + ' ' + state.ranked.highestRankedEntry.division">
            </div>
            <div class="split-icon">
                <img class="no-sel" src="../assets/images/icon/arcane_jinx.png">
                <img class="no-sel" src="../assets/images/icon/arcane_vi.png">
                <img class="no-sel" src="../assets/images/icon/arcade_dpengu.png">
                <img class="no-sel" src="../assets/images/icon/em_bee_happy.png">
                <img class="no-sel" src="../assets/images/icon/sentinel_poro.png">
                <img class="no-sel" src="../assets/images/icon/thumb_happy_up.png">
            </div>
        </div>
        <div class="game-record" v-if="state.match">
            <div v-for="(item, index) in state.match" :key="index" class="game-record-item" @click="getGameDetail(item)" @mouseenter="inRecord($event)" @mouseleave="outRecord()">
                <div class="item-champ-square" :style="{
                    backgroundImage: `url(${item.participants[0].image})`,
                    backgroundPosition: item.participants[0].backgroundPosition}">
                    <div class="champ-level">
                        <span>{{ item.participants[0].stats.champLevel }}</span>
                    </div>
                </div>
                <div class="txt-align-right mgr-15 stats">
                    <div :class="[item.participants[0].stats.win ? 'win' : 'defeat']">
                        <span>{{ item.participants[0].stats.kills }}</span>
                        <span>/</span>
                        <span>{{ item.participants[0].stats.deaths }}</span>
                        <span>/</span>
                        <span>{{ item.participants[0].stats.assists }}</span>
                    </div>
                    <span class="fs-12">{{ QUEUES_MAP[item.queueId] }}</span>
                </div>
            </div>
        </div>
        <div class="mouse-on" :style="{
            top: `${state.pointer.Y}px`,
            animationPlayState: state.pointer.visible ? 'running' : 'paused',
            opacity: state.pointer.visible ? '1' : '0'
        }">👉</div>
        <div class="game-choosen" :style="{
            transform: `translateY(${state.sign.Y}px)`,
            opacity: state.sign.visible ? '1' : '0'
        }">⚜️</div>
    </div>
</template>

<script lang="ts">

import { computed, defineComponent, reactive, inject, watchEffect } from 'vue'
import store from '../store'

// components
import RingLoading from './RingLoading.vue'

// assets
// img/crests
import iron from '../assets/images/crests/iron.png'
import bronze from '../assets/images/crests/bronze.png'
import silver from '../assets/images/crests/silver.png'
import gold from '../assets/images/crests/gold.png'
import platinum from '../assets/images/crests/platinum.png'
import diamond from '../assets/images/crests/diamond.png'
import master from '../assets/images/crests/master.png'
import grandmaster from '../assets/images/crests/grandmaster.png'
import challenger from '../assets/images/crests/challenger.png'
import unranked from '../assets/images/crests/unranked.png'
// json
import QUEUES_MAP_JSON from '../assets/json/queuesMap.json'

// api
import { getLolMatchHistoryV1GamesByGameId } from '../api/api'

export default defineComponent({
    name: 'basicInfo',
    components: { RingLoading },
    props: {
        gameDetail: { required: true }
    },
    setup(props, context) {
        
        const state: any = reactive({
            summoner: null,
            ranked: null,
            match: null,
            gameDetail: {},
            pointer: { Y: 145, visible: false },    
            sign: { Y: 145, visible: false },
            rankedIcon: computed(() => RANKED_ICON[state.ranked.highestRankedEntry.tier.toLowerCase()]),
        })

        // 鼠标移入对局记录
        function inRecord(e: any) {
            state.pointer.Y = e.target.offsetTop + 16
            state.pointer.visible = true
        }
        // 鼠标移出对局记录
        function outRecord() {
            state.pointer.visible = false
        }
        
        interface IUniversal { [key: string]: any }
        // 地图
        const QUEUES_MAP: IUniversal = QUEUES_MAP_JSON
        // 排位图标
        const RANKED_ICON: IUniversal = { iron, bronze, silver, gold, platinum, diamond, master, grandmaster, challenger, unranked }

        const inSomething: any = inject('busy')
		const nothing: any = inject('idle')

        // 初始化
		function init() {
            if(store.state.summoner === null || store.state.match === null && store.state.ranked === null) return
			state.summoner = store.state.summoner
			state.ranked = store.state.ranked
			state.match = store.state.match.games.games.map((game: IUniversal) => {
                // 添加图片信息和偏移
                const champion = store.state.championMap[game.participants[0].championId]
                game.participants[0].image = store.state.championSprite[champion.sprite]
                game.participants[0].backgroundPosition = `-${champion.x}px -${champion.y}px`
                game.active = false
                return game
            }).reverse()
		}
        watchEffect(init)

        interface Game { [key: string]: any }
        async function getGameDetail(item: Game) {
            if(state.gameDetail.hasOwnProperty('gameId') && item.gameId === state.gameDetail.gameId) return
            inSomething()
            state.sign.Y = state.pointer.Y - 150
            state.sign.visible = true
            state.gameDetail = await getLolMatchHistoryV1GamesByGameId(store.state.clientInfo, item.gameId)
            
            context.emit('update:gameDetail', state.gameDetail)

        }


        return { state, inRecord, outRecord, getGameDetail, QUEUES_MAP }

    }
})
</script>

<style lang="scss" scoped>
.basic-info-container {
    width: 260px;
    height: 650px;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 10px 25px rgb(0 0 0 / 10%);
    position: relative;
}
.summoner-info {
    position: relative;
    // padding-bottom: 20px;
    border-bottom: 1px solid rgb(205 190 145 / 50%);
    .summoner-avatar {
        background-color: #f2f1f6;
        width: 100px;
        height: 100px;
        border-radius: 50px;
        position: absolute;
        top: -50px;
        left: 80px;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;
        border: 1px solid #cdbe91;
        outline: 1px solid #cdbe91;
        img {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            margin: auto;
            width: 90%;
            height: 90%;
            border-radius: 50%;
            box-sizing: border-box;
            border: 1px solid #cdbe91;
            outline: 1px solid #cdbe91;
        }
    }
    .summoner-level {
        position: absolute;
        text-align: center;
        font-size: 17px;
        background-color: red;
        top: 43px;
        left: 105px;
        right: 105px;
        // bottom: 0;
        user-select: none;
    }   
    .summoner-name {
        padding-top: 60px;
        text-align: center;
        .ranked-img {
            width: 25px;
            vertical-align: sub;
        }
    }
    .split-icon {
        width: 100%;
        height: 20px;
        text-align: center;
        margin-bottom: -5px;
        padding-top: 10px;
        img {
            width: 25px;
        }
    }
}
.game-record {
    height: 510px;
    padding: 15px 0 10px 0;
    .game-record-item {
        position: relative;
        box-sizing: border-box;
        border: 1px solid transparent;
        border-right: none;
        border-left: none;
        height: 50px;
        justify-content: space-between;
        align-items: center;
        display: flex;
        transition: all .08s ease-in-out;
        user-select: none;
        &:hover {
            cursor: pointer;
        }
        &:active {
            transform: scale(.99);
        }
        .item-champ-square {
            width: 48px;
            height: 48px;
            margin-left: 13px;
            border-radius: 50%;
            border: 1px solid #fff;
            outline: 1px solid #785A28;
            transition: all .15s ease-in-out;
            position: relative;
            transform: scale(.75);
            .champ-level {
                transform: scale(1.35);
                position: absolute;
                bottom: -2px;
                right: -4px;
                width: 16px;
                height: 16px;
                text-align: center;
                line-height: 16px;
                border: 1px solid #b8860b;
                border-radius: 50%;
                background-color: #010a13;
                font-size: 12px;
                color: #f3f3f3;
                span {
                    display: block;
                    transform: scale(calc(10 / 12));
                }
            }
        }
        .stats {
            width: 80px;
        }
        .win {
            color: #0984e3;
        }
        .defeat {
            color: #d63031;
        }
        &::after {
            content: "";
            position: absolute;
            top: -1px;
            right: 0;
            width: 185px;
            height: 1px;
            background-color: rgb(0 0 0 / 10%);
        }
        &:first-child::after {
            display: none;
        }
        .active {
            position: absolute;
            right: -35px;
        }
    }
}
@keyframes point {
    0% {
        transform: translateX(0px);
    }
    50% {
        transform: translateX(10px);
    }
    100% {
        transform: translateX(0px);
    }
}
.mouse-on {
    position: absolute;
    left: -40px;
    transition: all .15s linear;
    animation: point 1.2s ease-in-out infinite;
}
.game-choosen {
    position: absolute;
    top: 145px;
    right: -37px;
    transition: transform 0.3s ease-out;
}
</style>