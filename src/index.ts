import AuthProxyServer from "./network/AuthProxyServer"
import { MsgAction } from "./redux/types"
import Proxy from "./network/Proxy"
import { attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight, talkToNPC, replyToNPC,inviteToKoliGrp, getMapInfo } from "./api/"
import { ObservableArrayFactory } from "./utils/ObservableArray"

export const gameProxies = ObservableArrayFactory<Proxy>()

export function startAuthServer() {
    const authProxy = new AuthProxyServer(gameProxies)
    authProxy.start()
}
export const actionsApi = {
    attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight, replyToNPC, talkToNPC, getMapInfo, inviteToKoliGrp
}
export type ProxyType = Proxy
export type Action = MsgAction;
