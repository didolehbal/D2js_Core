import AuthProxy from "./network/AuthProxy"
import GameProxy from "./network/GameProxy"
import {hook} from "./hook/hookers"

export function start(){
    const authProxy = new AuthProxy()
    authProxy.start()
    
    const gameProxy = new GameProxy("thanatena.ankama-games.com", 7778)
    gameProxy.start()
}
export function spawnClient(){
    hook()
}
