import { createStore } from "vuex";

export default createStore({
    state() {
        return {
            clientInfo: { port: '', auth: '' },
            version: '',
            summoner: null,
            ranked: null,
            match: null,
            perks: {},
            championJson: {},
            championMap: {},
            championSprite: {},
            summonerJson: {},
            summonerMap: {},
            summonerSprite: {},
            items: {},
            itemSprite: {},
            settingsSwitch: false,
            wsState: '0',
            defaultSubscribe: [
                'OnJsonApiEvent_lol-summoner_v1_current-summoner',
				'OnJsonApiEvent_lol-matchmaking_v1_ready-check'
            ],
            subscribed: [] as string[],
            listend: [] as string[]
        }
    },
    mutations: {
        setClientInfo(state: any, { port, auth }) {
            state.clientInfo.port = port
            state.clientInfo.auth = auth
        },
        setVersion(state: any, ver: string) {
            state.version = ver
        },
        setSummoner(state: any, payload) {
            state.summoner = payload
        },
        setRanked(state: any, payload) {
            state.ranked = payload
        },
        setMatch(state: any, payload) {
            state.match = payload
        },
        setPerks(state: any, payload) {
            state.perks = payload
        },
        setChampionJson(state: any, payload) {
            state.championJson = payload
        },
        setChampionMap(state: any, payload) {
            state.championMap = payload
        },
        setChampionSprite(state: any, payload) {
            state.championSprite = payload
        },
        setSummonerJson(state: any, payload) {
            state.summonerJson = payload
        },
        setSummonerMap(state: any, payload) {
            state.summonerMap = payload
        },
        setSummonerSprite(state: any, payload) {
            state.summonerSprite = payload
        },
        setItems(state: any, payload) {
            state.items = payload
        },
        setItemsSprite(state: any, payload) {
            state.itemSprite = payload
        },
        setSettingsSwitch(state: any, payload) {
            state.settingsSwitch = payload
        },
        setWsState(state: any, payload) {
            state.wsState = payload
        },
        appendSubscribed(state: any, payload) {
            state.subscribed.push(payload)
        },
        appendListend(state: any, payload) {
            state.listend.push(payload)
        }
    }
})