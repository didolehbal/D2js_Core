import ProxyServer from "./ProxyServer";
import { Socket } from "net"
import Config from "../config.json"
import Proxy from "./Proxy"
import { MsgAction } from "../redux/types"
import GameProxyServer from "./GameProxyServer";
import { ObservableArray } from "../utils/ObservableArray";

export default class AuthProxyServer extends ProxyServer {
    private gameServers: ProxyServer[]
    private gameServersPort: number = 7000
    constructor(private gameProxies: ObservableArray<Proxy>) {
        super(Config.authServerIps[0], Config.port)
        this.gameServers = []
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
        dofusServer.on("connect", () => console.log("connected to dofus Auth server !"))

        const doInBackground = (data: any) => {
            if (this.gameServers.filter(server => {
                return server.address == data.address
            }).length == 0) {
                const server = new GameProxyServer(data.address, ++this.gameServersPort, this.gameProxies)
                server.start()
                this.gameServers.push(server)
            }
            console.log(`redirected from ${data?.address} ${data?.ports}`)
        }
        const alter = (data: any) => {
            data.address = "localhost";
            data.ports = [this.gameServersPort]
            console.log(`to localhost [5555]`)
        }
        const msgAction1: MsgAction = {
            protocolId: 6469,
            typeName: "SelectedServerDataMessage",
            doInBackground,
            alter,

        }
        const msgAction2: MsgAction = {
            protocolId: 42,
            typeName: "SelectedServerDataExtendedMessage",
            doInBackground,
            alter
        }
        const proxy = new Proxy(dofusClient, dofusServer, [msgAction1, msgAction2]);
        proxy.start()
    }
}