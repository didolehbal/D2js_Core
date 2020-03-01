import { Socket } from "net";
import PacketHandler from "./PacketHandler"
import SelectedServerDataMessage from "../ankama/SelectedServerDataMessage"
import Message from "../ankama/Message";

export default class SocketHandler {
    private client: Socket;
    private server: Socket;
    private _MessagesToHandle: Message[]
    constructor(client: Socket, server: Socket, messagesToHandle: Message[]) {
        this.client = client;
        this.server = server;
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

            //let processedData = data
            let packetHandler   = new PacketHandler("Server", this._MessagesToHandle);
            let processedData = packetHandler.processChunk(data)
           

            var flushed = client.write(processedData);
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

        server.on('close', function (had_error) {
            console.log("disconected")
            client.end();
        });
    }
}