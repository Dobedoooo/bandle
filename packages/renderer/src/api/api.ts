import got from 'got'
import { lcu, toBase64 } from '../utils/utils'

const HOST: string = 'https://127.0.0.1'
const URL = {
    fileBase: 'http://47.97.11.78:8080',
    ddragon: 'http://ddragon.leagueoflegends.com',
    currentSummoner: '/lol-summoner/v1/current-summoner',
    matchHistory: '/lol-match-history/v3/matchlist/account/',
    rankedStats: '/lol-ranked/v1/ranked-stats/',
    game: '/lol-match-history/v1/games/',
    perks: '/lol-perks/v1/perks',
    accept: '/lol-matchmaking/v1/ready-check/accept'
}

type matchConfig = {
    begIndex: number,
    endIndex: number
}

// 封装了 auth https http2
function gotSth(auth: string, url: string, http2 = false) {
    return got(url, {
        headers: { Authorization: toBase64(auth) },
        https: { rejectUnauthorized: false },
        http2
    })
}

// 游戏版本数组
function getCurrentVersion() {
    return got(`${URL.ddragon}/api/versions.json`).json()
}

// 当前召唤师
function getLolSummonerV1CurrentSummoner(clientInfo:lcu): Promise<any> {
    const url = `${HOST}:${clientInfo.port}${URL.currentSummoner}`
    return gotSth(clientInfo.auth, url).json()
}

// 历史对局
function getLolMatchHistoryV3MatchlistAccountByAccountId(clientInfo: lcu, accountId: number, config: matchConfig): Promise<any> {
    const url = `${HOST}:${clientInfo.port}${URL.matchHistory}${accountId}?begIndex=${config.begIndex}&endIndex=${config.endIndex}`
    return gotSth(clientInfo.auth, url, true).json()
    
}

// 段位
function getLolRankedV1RankedStatsByPuuid(clientInfo: lcu, puuid:string): Promise<any> {
    const url = `${HOST}:${clientInfo.port}${URL.rankedStats}${puuid}`
    return gotSth(clientInfo.auth, url).json()
}

// 召唤师头像profileicon 英雄头像champion
function getIcon(ver: string, type: string, iconId: number) {
    const url = `${URL.ddragon}/cdn/${ver}/img/${type}/${iconId}.png`
    return got(url).buffer()
}

// 对局详情
function getLolMatchHistoryV1GamesByGameId(clientInfo: lcu, gameId: number): Promise<any> {
    const url = `${HOST}:${clientInfo.port}${URL.game}${gameId}`
    return gotSth(clientInfo.auth, url, true).json()
}

// JSON: summoner.json champion.json item.json
function getJson(ver: string, type: string) {
    const url = `${URL.fileBase}/static/json/${ver}/${type}.json`
    return got(url).json()
}

// 雪碧图
function getSprite(ver: string, sprite: string) {
    const url = `${URL.fileBase}/static/image/${ver}/${sprite}`
    return got(url).buffer()
}

// 符文
function getPerks(clientInfo: lcu) {
    const url = `${HOST}:${clientInfo.port}${URL.perks}`
    return gotSth(clientInfo.auth, url).json()
}

// 获取通用资源
function getFromPath(clientInfo: lcu, path: string) {
    const url = `${HOST}:${clientInfo.port}${path}`
    return gotSth(clientInfo.auth, url).buffer()
}

// 接受对局
function accept(clientInfo: lcu): void {
    const url = `${HOST}:${clientInfo.port}${URL.accept}`
    got(url, {
        headers: { Authorization: toBase64(clientInfo.auth) },
        https: { rejectUnauthorized: false },
        http2: true,
        method: 'POST'
    })
}

export { 
    getCurrentVersion,
    getLolSummonerV1CurrentSummoner,
    getLolMatchHistoryV3MatchlistAccountByAccountId,
    getLolRankedV1RankedStatsByPuuid,
    getIcon,
    getLolMatchHistoryV1GamesByGameId,
    getSprite,
    getPerks,
    getFromPath,
    getJson,
    accept,
}