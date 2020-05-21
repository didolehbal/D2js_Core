import AuthProxyServer from "./network/AuthProxyServer"
import { hook } from "./hook/hookers"
import { MsgAction } from "./redux/types"
import Proxy from "./network/Proxy"
import { attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight, talkToNPC, replyToNPC, getMapInfo } from "./api/"
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
spawnClient()
setTimeout(()=> {
    spawnClient()
},1000)*/

export const api = {
    attackPlayer, saveZaap, teleport, usePopoRappel, useObject, passeTour, joinFight, readyFight, replyToNPC, talkToNPC, getMapInfo
}
export type ProxyType = Proxy
export type Action = MsgAction;



/*
GameRolePlayShowChallengeMessage
MapFightCountMessage
GameFightUpdateTeamMessage x3
GameRolePlayRemoveChallengeMessage

MapFightCountMessage // end of fight
MapRunningFightListRequestMessage
MapRunningFightListMessage

MapRunningFightDetailsRequestMessage
MapRunningFightDetailsMessage
*/