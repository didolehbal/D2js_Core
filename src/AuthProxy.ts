import Proxy from "./Proxy";
import {Socket} from "net"
import Config from "./config.json"
import SocketHandler from "./network/SocketHandler"
import SelectedServerDataExtendedMessage from "./ankama/SelectedServerDataExtendedMessage";
import SelectedServerDataMessage from "./ankama/SelectedServerDataMessage";

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

    let selectedservDataExtended = new SelectedServerDataExtendedMessage()
    let selectedservData = new SelectedServerDataMessage()
    
    const socketHandler = new SocketHandler(dofusClient, dofusServer,[selectedservDataExtended, selectedservData]);
    socketHandler.start()
}
}