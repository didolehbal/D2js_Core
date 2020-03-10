import AuthProxy from "./network/AuthProxy"
import GameProxy from "./network/GameProxy.js"
import {hook} from "./hook/hookers"

hook()
const authProxy = new AuthProxy()
authProxy.start()

const gameProxy = new GameProxy("thanatena.ankama-games.com", 7778)
gameProxy.start()