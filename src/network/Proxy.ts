import Net, { Server, Socket } from "net";
import SocketHandler from "./SocketHandler"

export default abstract class Proxy {
    protected _proxy: Server;
    protected _remoteAddress: string;
    protected _remotePort: number;
    protected _localPort: number;
    
    constructor(remoteAddress: string, localPort: number, remotePort: number = 5555) {
        this._remoteAddress = remoteAddress;
        this._localPort = localPort;
        this._remotePort = remotePort;
        this._proxy = Net.createServer()
    }

    public start() {

        this._proxy.on("connection", this.handleConnection);
        this._proxy.on("error", (err) => {
            console.log(err)
        })
        this._proxy.on("listening", () => {
            console.log(`proxy started for remoteAddres ${this._remoteAddress} at port ${this._localPort}`)
        })
        this._proxy.on("close", () => {
            console.log("client disconnected...")
        })
        this._proxy.listen({ host: "localhost", port: this._localPort })
    }

    protected abstract handleConnection(dofusClient: Socket): void;
}