import AuthProxyServer from "./network/AuthProxyServer"
import { MsgAction } from "./redux/types"
import Proxy from "./network/Proxy" 
import { ObservableArrayFactory } from "./utils/ObservableArray"

export const gameProxies = ObservableArrayFactory<Proxy>()

export function startAuthServer() {
    const authProxy = new AuthProxyServer(gameProxies)
    authProxy.start()
}

//startAuthServer()

export  * as actionsApi from "./api/"
export type ProxyType = Proxy
export type Action = MsgAction;
