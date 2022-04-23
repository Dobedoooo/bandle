import got from 'got'
import { lcu, toBase64 } from '../utils/utils'
import fs from 'fs'

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

const RIOT_GAMES_PEM = `-----BEGIN CERTIFICATE-----
MIIEIDCCAwgCCQDJC+QAdVx4UDANBgkqhkiG9w0BAQUFADCB0TELMAkGA1UEBhMC
VVMxEzARBgNVBAgTCkNhbGlmb3JuaWExFTATBgNVBAcTDFNhbnRhIE1vbmljYTET
MBEGA1UEChMKUmlvdCBHYW1lczEdMBsGA1UECxMUTG9MIEdhbWUgRW5naW5lZXJp
bmcxMzAxBgNVBAMTKkxvTCBHYW1lIEVuZ2luZWVyaW5nIENlcnRpZmljYXRlIEF1
dGhvcml0eTEtMCsGCSqGSIb3DQEJARYeZ2FtZXRlY2hub2xvZ2llc0ByaW90Z2Ft
ZXMuY29tMB4XDTEzMTIwNDAwNDgzOVoXDTQzMTEyNzAwNDgzOVowgdExCzAJBgNV
BAYTAlVTMRMwEQYDVQQIEwpDYWxpZm9ybmlhMRUwEwYDVQQHEwxTYW50YSBNb25p
Y2ExEzARBgNVBAoTClJpb3QgR2FtZXMxHTAbBgNVBAsTFExvTCBHYW1lIEVuZ2lu
ZWVyaW5nMTMwMQYDVQQDEypMb0wgR2FtZSBFbmdpbmVlcmluZyBDZXJ0aWZpY2F0
ZSBBdXRob3JpdHkxLTArBgkqhkiG9w0BCQEWHmdhbWV0ZWNobm9sb2dpZXNAcmlv
dGdhbWVzLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAKoJemF/
6PNG3GRJGbjzImTdOo1OJRDI7noRwJgDqkaJFkwv0X8aPUGbZSUzUO23cQcCgpYj
21ygzKu5dtCN2EcQVVpNtyPuM2V4eEGr1woodzALtufL3Nlyh6g5jKKuDIfeUBHv
JNyQf2h3Uha16lnrXmz9o9wsX/jf+jUAljBJqsMeACOpXfuZy+YKUCxSPOZaYTLC
y+0GQfiT431pJHBQlrXAUwzOmaJPQ7M6mLfsnpHibSkxUfMfHROaYCZ/sbWKl3lr
ZA9DbwaKKfS1Iw0ucAeDudyuqb4JntGU/W0aboKA0c3YB02mxAM4oDnqseuKV/CX
8SQAiaXnYotuNXMCAwEAATANBgkqhkiG9w0BAQUFAAOCAQEAf3KPmddqEqqC8iLs
lcd0euC4F5+USp9YsrZ3WuOzHqVxTtX3hR1scdlDXNvrsebQZUqwGdZGMS16ln3k
WObw7BbhU89tDNCN7Lt/IjT4MGRYRE+TmRc5EeIXxHkQ78bQqbmAI3GsW+7kJsoO
q3DdeE+M+BUJrhWorsAQCgUyZO166SAtKXKLIcxa+ddC49NvMQPJyzm3V+2b1roP
SvD2WV8gRYUnGmy/N0+u6ANq5EsbhZ548zZc+BI4upsWChTLyxt2RxR7+uGlS1+5
EcGfKZ+g024k/J32XP4hdho7WYAS2xMiV83CfLR/MNi8oSMaVQTdKD8cpgiWJk3L
XWehWA==
-----END CERTIFICATE-----`

// 封装了 auth https http2
function gotSth(auth: string, url: string, options = {}) {
    return got(url, Object.assign({
        headers: { Authorization: toBase64(auth) },
        https: { 
            // rejectUnauthorized: false,
            certificateAuthority: RIOT_GAMES_PEM
        },
        http2: true
    }, options))
}

// 游戏版本数组
function getCurrentVersion(): Promise<string[]> {
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
    return gotSth(clientInfo.auth, url).json()
    
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
    return gotSth(clientInfo.auth, url).json()
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
function accept(clientInfo: lcu) {
    const url = `${HOST}:${clientInfo.port}${URL.accept}`
    return gotSth(clientInfo.auth, url, { method: 'POST' }).json()
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