import ProxyServer from "./ProxyServer";
import {Socket} from "net"
import Proxy from "./Proxy"

export default class GameProxyServer extends ProxyServer {
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
    
        const proxy = new Proxy(dofusClient, dofusServer,[]);
        proxy.start()
    }
}