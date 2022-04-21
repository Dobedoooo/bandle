
import WebSocketNode from 'ws'

const MESSAGE_TYPE = {
    WELCOME: 0,
    PREFIX: 1,
    CALL: 2,
    CALLRESULT: 3,
    CALLERROR: 4,
    SUBSCRIBE: 5,
    UNSUBSCRIBE: 6,
    PUBLISH: 7,
    EVENT: 8,
}

interface ClientInfo {
    port: string,
    auth: string,
    err: string
}

export default class RiotWsProtocol extends WebSocketNode {
    session: null;
    
    constructor(clientInfo: string) {
        const info: ClientInfo = JSON.parse(clientInfo)
        super(`wss://riot:${info.auth}@127.0.0.1:${info.port}`, 'wamp', {
            rejectUnauthorized: false
        })

        this.session = null
        this.on('message', this._onMessage.bind(this))
    }

    close(): void {
        super.close()
        this.session = null
    }

    subscribe(topic: string, callback: any): void {
        // 开始监听
        super.addListener(topic, callback)
        this.sender(MESSAGE_TYPE.SUBSCRIBE, topic)
    }

    unSubscribe(topic: string, callback: any): void {
        // 结束监听
        super.removeListener(topic, callback)
        this.sender(MESSAGE_TYPE.UNSUBSCRIBE, topic)
    }

    sender(type: number, message: string): void {
        super.send(JSON.stringify([type, message]))
    }

    _onMessage(message: string) {
        const [type, ...data] = JSON.parse(message)

        switch(type) {
            case MESSAGE_TYPE.WELCOME:
                this.session = data[0]
                break;
            case MESSAGE_TYPE.EVENT:
                const [topic, payload] = data
                // 触发自定义事件
                this.emit(topic, payload)
                break;
            default:
                break;
        }
    }

}