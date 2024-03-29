import ProxyServer from "./ProxyServer";
import { Socket } from "net"
import Config from "../config.json"
import Proxy from "./Proxy"
import { MsgAction } from "../redux/types"
import GameProxyServer from "./GameProxyServer";
import { ObservableArray } from "../utils/ObservableArray";
import {types} from "../utils/protocol.json"
import { CustomSocksProxy } from "./CustomSocksProxy";

type gameServerToPort = {
    port : number
    serverAdress: string
}
export default class AuthProxyServer extends ProxyServer {
    private gameServers: ProxyServer[]
    private gameServersPort: gameServerToPort[] = []
    private PORT_INDEX = 7000
    constructor(private gameProxies: ObservableArray<Proxy>, private socksProxy : CustomSocksProxy,) {
        super(Config.authServerIps[1], Config.port)
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
                const servPort:gameServerToPort = {
                    port:++this.PORT_INDEX,
                    serverAdress:data.address
                }
                this.gameServersPort.push(servPort)

                const server = new GameProxyServer(data.address,servPort.port , this.gameProxies, this.socksProxy)
                server.start()
                this.gameServers.push(server)
            }
            console.log(`redirected from ${data?.address} ${data?.ports}`)
        }

        const alter = (data: any) => {
            const port = this.gameServersPort.filter(s =>s.serverAdress == data.address)[0].port
            data.ports = [port]
            data.address = "127.0.0.1";
            console.log(`to localhost [${port}]`)
        }

        const msgAction1: MsgAction = {
            protocolId: types["SelectedServerDataMessage"].protocolId,
            typeName: "SelectedServerDataMessage",
            doInBackground,
            alter,

        }
        const msgAction2: MsgAction = {
            protocolId: types["SelectedServerDataExtendedMessage"].protocolId,
            typeName: "SelectedServerDataExtendedMessage",
            doInBackground,
            alter
        }
        const proxy = new Proxy(dofusClient, dofusServer, [msgAction1, msgAction2]);
        proxy.start()
    }
}