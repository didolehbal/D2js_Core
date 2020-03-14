import AuthProxyServer from "./network/AuthProxyServer"
import GameProxyServer from "./network/GameProxyServer"
import { hook } from "./hook/hookers"
import { MsgAction } from "./types"
import Proxy from "./network/Proxy"


export const gameProxies: Proxy[] = new Array<Proxy>()

export function startGameServer(address: string = "thanatena.ankama-games.com", port: number = 7778) {
    const gameProxy = new GameProxyServer(address, port, gameProxies)
    gameProxy.start()
}
export function spawnClient() {
    return hook()
}


export function startAuthServer() {
    const authProxy = new AuthProxyServer()
    authProxy.start()
}

export type Action = MsgAction;

startAuthServer()
startGameServer()
spawnClient()