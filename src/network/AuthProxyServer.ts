import ProxyServer from "./ProxyServer";
import {Socket} from "net"
import Config from "../config.json"
import Proxy from "./Proxy"
import {MsgAction } from "../types"

export default class AuthProxyServer extends ProxyServer {
    constructor() {
        super(Config.authServerIps[1], Config.port)
    }
    
   protected handleConnection = (dofusClient:Socket) => {

    console.log("dofus client connected")

    const dofusServer: Socket = new Socket()

    try {
        console.log({ port: this._remotePort, host: this._remoteAddress })
        dofusServer.connect({ port: this._remotePort, host: this._remoteAddress });
    }
    catch (ex) {
        console.trace(ex)
        process.exit(-1)
    }
    dofusServer.on("connect",()=>console.log("connected to dofus Auth server !"))
    
    const msgAction1 : MsgAction = {
        protocolId:6469,
        typeName:"SelectedServerDataMessage",
        alter:function(data:any) {
            //TODO : start a game ProxyServer server based on data.adress if not already done
            data.address = "localhost";
            data.ports =[7778]
        },
        doInBackground:function(data:any){
            console.log(`redirected from ${data?.address} ${data?.ports} to localhost [5555]`)
        }
    }
    const msgAction2 : MsgAction = {
        protocolId:42,
        typeName:"SelectedServerDataExtendedMessage",
        alter:function(data:any) {
            data.address = "localhost";
            data.ports =[7778]
        },
        doInBackground:function(data:any){
            console.log(`redirected from ${data?.address} ${data?.ports} to localhost [5555]`)
        }
    }
    const proxy = new Proxy(dofusClient, dofusServer,[msgAction1,msgAction2]);
    proxy.start()
}
}