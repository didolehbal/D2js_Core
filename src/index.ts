import AuthProxyServer from "./network/AuthProxyServer"
import { hook } from "./hook/hookers"
import { MsgAction } from "./redux/types"
import Proxy from "./network/Proxy"
import { attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight,talkToNPC, replyToNPC } from "./api/"
import { ObservableArrayFactory } from "./utils/ObservableArray"

export const gameProxies = ObservableArrayFactory<Proxy>()

export function spawnClient() {
    return hook()
}

export function startAuthServer() {
    const authProxy = new AuthProxyServer(gameProxies)
    authProxy.start()
}

/*startAuthServer()
spawnClient()*/

export const api = {
    attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight,replyToNPC, talkToNPC
}
export type ProxyType = Proxy
export type Action = MsgAction;