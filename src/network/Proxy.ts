import { Socket } from "net";
import ServerMessagingHandler from "./ServerMessagingHandler";
import ClientMessagingHandler from "./ClientMessagingHandler"
import { MsgAction } from "../types"

export default class SocketHandler {
    private client: Socket;
    private server: Socket;
    private serverMessagingHandler: ServerMessagingHandler;
    private clientMessagingHandler: ClientMessagingHandler;
    constructor(client: Socket, server: Socket, serverMsgsActions: MsgAction[]) {
        this.client = client;
        this.server = server;
        this.serverMessagingHandler = new ServerMessagingHandler(serverMsgsActions)
        this.clientMessagingHandler = new ClientMessagingHandler([])
    }

    public sendToClient = (data: Buffer) => {
        let flushed = this.client.write(data);
        if (!flushed) {
            console.log("/!\ client not flushed; pausing local");
            this.server.pause();
        }
    }

    public sendToServer = (data: Buffer) => {
        let flushed = this.server.write(data);
        if (!flushed) {
            console.log("/!\ server not flushed; pausing local");
            this.client.pause();
        }
    }

    public start = () => {
        const { server, client } = this;
        client.on("data", (data) => {
            try{
            const processedData: Buffer = this.clientMessagingHandler.processChunk(data)
            this.sendToServer(processedData)
            }catch(ex){
                console.trace(ex)
                this.sendToServer(data)
                this.clientMessagingHandler.reset()
            }
        })

        server.on("data", (data) => {
            try {
                const processedData: Buffer = this.serverMessagingHandler.processChunk(data)
                this.sendToClient(processedData)
            } catch (ex) {
                console.trace(ex)
                this.sendToClient(data)
                this.serverMessagingHandler.reset()
            }
        })


        client.on('drain', function () {
            server.resume();
        });

        client.on('close', function (had_error) {
            console.log("Client Disconnected",{error:had_error})
            server.end();
        });
        server.on('drain', function () {
            client.resume();
        });

        server.on('close', function (had_error: any) {
            console.log("Server Disconnected",{error:had_error})
            client.end();
        });
    }
}