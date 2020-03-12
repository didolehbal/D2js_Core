import AuthProxyServer from "./network/AuthProxyServer"
import GameProxyServer from "./network/GameProxyServer"
import {hook} from "./hook/hookers"

export function start(){
    const authProxy = new AuthProxyServer()
    authProxy.start()
    
    const gameProxy = new GameProxyServer("thanatena.ankama-games.com", 7778)
    gameProxy.start()
}
export function spawnClient(){
    hook()
}
