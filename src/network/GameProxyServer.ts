import ProxyServer from "./ProxyServer";
import { Socket } from "net"
import Proxy from "./Proxy"
import { ObservableArray } from "../utils/ObservableArray"
export default class GameProxyServer extends ProxyServer {
    private gameProxies: ObservableArray<Proxy>
    constructor(remoteAdress: string, localPort: number, gameProxies: ObservableArray<Proxy>) {
        super(remoteAdress, localPort)
        this.gameProxies = gameProxies
    }

    protected handleConnection = (dofusClient: Socket) => {

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
        dofusServer.on("connect", () => console.log("connected to dofus Game server !"))

        const proxy = new Proxy(dofusClient, dofusServer, []);
        proxy.start()

        dofusClient.on("close", (had_error) => {
            this.gameProxies.remove(proxy)
            console.log("Client Disconnected", { error: had_error })
            dofusServer.end();
        })

        this.gameProxies.push(proxy)
    }
}