import { Socket } from "net";
import Message from "../ankama/Message";
import DofusSocket from "./DofusSocket"
import SelectedServerDataExtendedMessage from "../ankama/SelectedServerDataExtendedMessage";
import SelectedServerDataMessage from "../ankama/SelectedServerDataMessage";
import PacketHandler from "./PacketHandler";
import Header from "./Header";

export default class SocketHandler {
    private client: Socket;
    private server: Socket;
    private _MessagesToHandle: Message[]
    private serverPacketHandler: PacketHandler;
    private clientPacketHandler: PacketHandler;
    constructor(client: Socket, server: Socket, messagesToHandle: Message[]) {
        this.client = client;
        this.server = server;
        this._MessagesToHandle = messagesToHandle
        this.serverPacketHandler = new PacketHandler([new SelectedServerDataExtendedMessage(),new SelectedServerDataMessage], "SERVER")
        this.clientPacketHandler = new PacketHandler([], "CLIENT")
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
            const processedData:Buffer = this.clientPacketHandler.processChunk(data)
            this.sendToServer(processedData)
        })

        server.on("data", (data) => {
            const processedData:Buffer = this.serverPacketHandler.processChunk(data)
            this.sendToClient(processedData)

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

        server.on('close', function (hadError: any) {
            console.log("disconected", hadError)
            client.end();
        });
    }
}