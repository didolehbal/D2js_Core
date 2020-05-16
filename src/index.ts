import AuthProxyServer from "./network/AuthProxyServer"
import GameProxyServer from "./network/GameProxyServer"
import { hook } from "./hook/hookers"
import { MsgAction } from "./redux/types"
import Proxy from "./network/Proxy"
import { attackPlayer, saveZaap, teleport, usePopoRappel, useObject } from "./api/"
import { ObservableArrayFactory } from "./utils/ObservableArray"

export const gameProxies = ObservableArrayFactory<Proxy>()

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

startAuthServer()
startGameServer()
spawnClient()

export const api = { attackPlayer, saveZaap, teleport, usePopoRappel, useObject }
export type Action = MsgAction;