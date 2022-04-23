import { exec } from "child_process";

type lcu =  {
    port: string,
    auth: string,
    err: boolean
}

// 通过命令行查看游戏是否正在运行
function isGameOn(): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const cmd:string = 'tasklist -V|findstr "LeagueClientUx.exe"'
        exec(cmd, { maxBuffer: 1024 * 2000 }, (err, stdout, stderr) => {
            if(err || stderr.length > 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        })
    })
    
}

// 通过命令行获取 league client 端口和密码
function getPortAndAuth(): Promise<lcu> {
    return new Promise((resolve, reject) =>{
        const cmd:string = "wmic PROCESS WHERE name='LeagueClientUx.exe' GET commandline"
        let info:lcu = { port: '', auth: '', err: false }
        exec(cmd, { maxBuffer: 1024 * 2000 }, (err, stdout, stderr) => {
            if(err || stderr.length > 0) {
                info.err = true
            } else {
                info.port = /--app-port=(.+?)\"/.exec(stdout)![1]
                info.auth = /--remoting-auth-token=(.+?)\"/.exec(stdout)![1]
            }
            resolve(info)
        })
    })
}

// 拼接 basic auth 字符串
function toBase64(string: string) {
    return 'Basic ' + Buffer.from(`riot:${string}`, 'utf-8').toString('base64')
}

// 数组去重 无法去 空对象{}
function unique(array: any[]) {
    return Array.from(new Set(array))
}

// 向主进程发送订阅事件消息
function subscribe() {

}
// 向主进程发送取消订阅消息
function ubSsubscribe() {
    
}

export { lcu, getPortAndAuth, isGameOn, toBase64, unique, subscribe, ubSsubscribe }