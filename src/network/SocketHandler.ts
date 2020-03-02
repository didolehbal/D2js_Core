import { Socket } from "net";
import PacketHandler from "./PacketHandler"
import Message from "../ankama/Message";
import DofusSocket from "./DofusSocket"

export default class SocketHandler {
    private client: Socket;
    private server: DofusSocket;
    private _MessagesToHandle: Message[]
    
    constructor(client: Socket, server: Socket, messagesToHandle: Message[]) {
        this.client = client;
        this.server = new DofusSocket(server);
        this._MessagesToHandle = messagesToHandle
    }

    public start = () => {
        const { server, client } = this;
        client.on("data", (data) => {
            var flushed = server.write(data);
            if (!flushed) {
                console.log(" server not flushed; pausing local");
                server.pause();
            }

        })

        server.on("data", (data) => {
            console.log(`===== new Chunk length ${data.length} ======` )
            //let packetHandler   = new PacketHandler("Server", this._MessagesToHandle);
            //let processedData = packetHandler.processChunk(data)
            var flushed = client.write(data);
            if (!flushed) {
                console.log(" client not flushed; pausing local");
                server.pause();
            }

        })


        client.on('drain', function () {
            server.resume();
        });

        client.on('close', function (had_error) {
            console.log("disconected")
            server.end();
        });
        server.on('drain', function () {
            client.resume();
        });

        server.on('close', function (hadError:any) {
            console.log("disconected",hadError)
            client.end();
        });
    }
}