import Proxy from "./Proxy";
import {Socket} from "net"
import Config from "./config.json"
import SocketHandler from "./SocketHandler"
import {MsgAction } from "../types"

export default class AuthProxy extends Proxy {
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
    const socketHandler = new SocketHandler(dofusClient, dofusServer,[msgAction1,msgAction2]);
    socketHandler.start()
}
}