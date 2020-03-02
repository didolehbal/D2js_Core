import Proxy from "./Proxy";
import {Socket} from "net"
import Config from "./config.json"
import SocketHandler from "./network/SocketHandler"
import SelectedServerDataMessage from "./ankama/SelectedServerDataMessage";

export default class GameProxy extends Proxy {
    constructor(remoteAdress:string,localPort:number) {
        super(remoteAdress, localPort)
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
        dofusServer.on("connect",()=>console.log("connected to dofus Game server !"))
    
        let msg = new SelectedServerDataMessage()
        const socketHandler = new SocketHandler(dofusClient, dofusServer,[msg]);
        socketHandler.start()
    }
}