<template>
	<div class="game-details-container">
		<div v-if="!Object.keys(game).length" class="no-data">
			<slot></slot>
			<span>选择一场对局以查看</span>
		</div>
		<div v-else>
			<div class="header">
				<div class="kda">⚔️</div>
				<div class="gold">💸</div>
				<div class="minions">👻</div>
			</div>
			<div class="team-blue">
				<div class="pdl-30 fs-10 pdt-10 pdb-10">🔵🔵🔵</div>
				<div v-for="(item, index) in state.game.participants" :key="index">
					<div :class="['participant', state.game.participantIdentities[index].player.summonerId === store.state.summoner.summonerId ? 'color-gold' : '']" v-if="item.teamId === 100">
						<div class="basic">
							<div class="perk">
								<img :src="item.perkIcon">
							</div>
							<div class="spell">
								<div class="spell-1" :style="{
									backgroundImage: `url(${item.spell1Img.image})`,
									backgroundPosition: item.spell1Img.position,
									backgroundSize: '1000% 400%',
								}">
								</div>
								<div class="spell-2" :style="{
									backgroundImage: `url(${item.spell2Img.image})`,
									backgroundPosition: item.spell2Img.position,
									backgroundSize: '1000% 400%',
								}">
								</div>
							</div>
							<div class="circle" :style="{
								backgroundImage: `url(${item.image})`,
								backgroundPosition: item.backgroundPosition
							}"></div>
							<div class="summoner-name">
								<span>{{ state.game.participantIdentities[index].player.summonerName }}</span>
							</div>
						</div>
						<div class="kda">
							<div>{{ item.stats.kills }}</div>
							<span>/</span>
							<div>{{ item.stats.deaths }}</div>
							<span>/</span>
							<div>{{ item.stats.assists }}</div>
						</div>
						<div class="minions">{{ item.stats.totalMinionsKilled }}</div>
						<div class="gold">{{ item.stats.goldEarned }}</div>
						<div class="item-con">
							<div class="items">
								<div :class="[`item-${index + 1}`]" v-for="(el, index) in [0, 1, 2, 3, 4, 5, 6]" :key="index" :style="{
									backgroundImage: item[`item_${index}`] ? `url(${store.state.itemSprite[item[`item_${index}`].image.sprite]})` : '',
									backgroundPosition: item[`item_${index}`] ? `-${item[`item_${index}`].image.x}px -${item[`item_${index}`].image.y}px` : ''
								}"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="team-red">
				<div class="pdl-30 fs-10 pdt-10 pdb-10">🔴🔴🔴</div>
				<div v-for="(item, index) in state.game.participants" :key="index">
					<div :class="['participant', state.game.participantIdentities[index].player.summonerId === store.state.summoner.summonerId ? 'color-gold' : '']" v-if="item.teamId === 200">
						<div class="basic">
							<div class="perk">
								<img :src="item.perkIcon">
							</div>
							<div class="spell">
								<div class="spell-1" :style="{
									backgroundImage: `url(${item.spell1Img.image})`,
									backgroundPosition: item.spell1Img.position,
									backgroundSize: '1000% 400%',
								}">
								</div>
								<div class="spell-2" :style="{
									backgroundImage: `url(${item.spell2Img.image})`,
									backgroundPosition: item.spell2Img.position,
									backgroundSize: '1000% 400%',
								}">
								</div>
							</div>
							<div class="circle" :style="{
								backgroundImage: `url(${item.image})`,
								backgroundPosition: item.backgroundPosition
							}"></div>
							<div class="summoner-name">
								<span>{{ state.game.participantIdentities[index].player.summonerName }}</span>
							</div>
						</div>
						<div class="kda">
							<div>{{ item.stats.kills }}</div>
							<span>/</span>
							<div>{{ item.stats.deaths }}</div>
							<span>/</span>
							<div>{{ item.stats.assists }}</div>
						</div>
						<div class="minions">{{ item.stats.totalMinionsKilled }}</div>
						<div class="gold">{{ item.stats.goldEarned }}</div>
						<div class="item-con">
							<div class="items">
								<div :class="[`item-${index + 1}`]" v-for="(el, index) in [0, 1, 2, 3, 4, 5, 6]" :key="index" :style="{
									backgroundImage: item[`item_${index}`] ? `url(${store.state.itemSprite[item[`item_${index}`].image.sprite]})` : '',
									backgroundPosition: item[`item_${index}`] ? `-${item[`item_${index}`].image.x}px -${item[`item_${index}`].image.y}px` : ''
								}"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, watchEffect, inject, nextTick } from "vue";

import store from '../store'

// assets

// api 
import {
	getFromPath,
} from '../api/api'

export default defineComponent({
	name: 'gameDetails',
	props: {
		game: { type: Object, required: true },
		loading: { type: Boolean, required: true }
	},
	setup(props, { emit }) {

		const state: any = reactive({
			game: {}
		})

		const inSomething: any = inject('busy')
		const idle: any = inject('idle')

        interface IUniversal { [key: string]: any }
		async function init() {
			// emit('update:loading', true)
			for(const element of props.game.participants) {
				// 召唤师技能
				const spell_1 = store.state.summonerMap[element.spell1Id]
				const spell_2 = store.state.summonerMap[element.spell2Id]
				element.spell1Img = { image: store.state.summonerSprite[spell_1.sprite], position: `-${spell_1.x / 2}px -${spell_1.y / 2}px` }
				element.spell2Img = { image: store.state.summonerSprite[spell_2.sprite], position: `-${spell_2.x / 2}px -${spell_2.y / 2}px` }

				// 英雄头像
				const champion = store.state.championMap[element.championId]
				element.image = store.state.championSprite[champion.sprite]
				element.backgroundPosition = `-${champion.x}px -${champion.y}px`

				// 符文
				await getFromPath(store.state.clientInfo, store.state.perks[element.stats.perk0]).then(buffer => {
					element.perkIcon = URL.createObjectURL(new Blob([buffer]))
				})

				// 装备
				
				for(const i of [0, 1, 2, 3, 4, 5, 6]) {
					if(element.stats[`item${i}`] !== 0) {
						element[`item_${i}`] = store.state.items[element.stats[`item${i}`]]
						element[`item_${i}`].id = element.stats[`item${i}`]
					} else {
						element[`item_${i}`] = null
					}
				}
			}
			state.game = props.game
			// emit('update:loading', false)
		}

		watchEffect(async() => {
			if(Object.keys(props.game).length === 0) return
			await init()
			idle()
		})

		return { state, store }

	}

})
</script>

<style lang="scss" scoped>
.game-details-container {
	position: relative;
	width: 100%;
	height: 100%;
	user-select: none;
	.no-data {
		box-sizing: border-box;
		padding-bottom: 60px;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #0984e3;
	}
	.header {
		div {
			display: inline-block;
		}
		.gold {
			width: 50px;
		}
		.minions {
			width: 50px;
		}
		.kda {
			width: 80px;
		}
	}
	.participant {
		padding: 0 30px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.basic {
			display: flex;
			justify-content: flex-start;
			.perk {
				display: flex;
				justify-content: center;
				align-items: center;
				img{
					width: 35px;
				}
			}
			.spell {
				box-sizing: border-box;
				position: relative;
				.spell-1, .spell-2 {
					width: 24px;
					height: 24px;
					border: 1px solid #b8860b;
				}
				.spell-1 { border-bottom: none; }
			}
			.circle {
				width: 48px;
				height: 48px;
				// box-sizing: border-box;
				border: 2px solid #b8860b;
				border-radius: 50%;
				transform: scale(.74);
			}
			.summoner-name {
				width: 160px;	
				display: flex;
				align-items: center;
				span {
					white-space: nowrap;
					text-overflow: ellipsis;
					cursor: pointer;
				}
			}
		}
		.item-con {
			width: 241px;
			.items {
				display: flex;
				width: 344px;
				transform: scale(.7) translateX(-26px);
				div {
					width: 48px;
					height: 48px;
					border: 1px solid #b8860b;
				}
				div:not(:last-child) {
					border-right: none;
				}
			}
		}
		.gold {
			width: 60px;
			text-align: center;
		}
		.minions {
			width: 50px;
			text-align: center;
		}
		.kda {
			width: 80px;
			display: flex;
			justify-content: space-around;
			div {
				width: 20px;
				text-align: center;
			}
		}
	}
	
}

</style>