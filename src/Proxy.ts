import Net, { Server, Socket } from "net";
import SocketHandler from "./network/SocketHandler"

export default class Proxy {
    private _proxy: Server;
    private _remoteAddress: string;
    private _remotePort = 5555;
    private _localPort = 5555;
    constructor(remoteAddress: string, localPort: number = 5555, remotePort: number = 5555 ) {
        this._remoteAddress = remoteAddress;
        this._localPort = localPort;
        this._remotePort = remotePort;
        this._proxy = Net.createServer()
    }

    public start() {
        console.log(`proxy started for remoteAddres ${this._remoteAddress}`)

        this._proxy.on("connection", this.handleConnection);
        this._proxy.on("error", (err) => {
            console.log(err)
        })
        this._proxy.on("listening", () => {
            console.log("Proxy listening...")
        })
        this._proxy.on("close", () => {
            console.log("client disconnected...")
        })
        this._proxy.listen({ host: "localhost", port: this._localPort })
    }

    private handleConnection(dofusClient: Socket) {

        console.log("dofus client connected")

        const dofusServer: Socket = new Socket()

        try {
            dofusServer.connect({ port: this._remotePort, host: this._remoteAddress });
        }
        catch (ex) {
            console.trace(ex)
            process.exit(-1)
        }
        const clientHandler = new SocketHandler(dofusClient, dofusServer, "CLIENT");

        const serverHandler = new SocketHandler(dofusServer, dofusClient, "SERVER");

    }
}