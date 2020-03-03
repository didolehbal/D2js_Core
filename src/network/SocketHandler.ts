import { Socket } from "net";
import Message from "../ankama/Message";
import DofusSocket from "./DofusSocket"
import SelectedServerDataExtendedMessage from "../ankama/SelectedServerDataExtendedMessage";
import SelectedServerDataMessage from "../ankama/SelectedServerDataMessage";

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
                console.log("server not flushed; pausing local");
                server.pause();
            }

        })

        server.on("data", ({header,rawMsg}) => {
            console.log(`===== packet ${header.packetID} length ${header.length} ======` )
            //let packetHandler   = new PacketHandler("Server", this._MessagesToHandle);
            //let processedData = packetHandler.processChunk(data)
            let msg :Message
            switch(header.packetID){
                case 6469:
                    msg= new  SelectedServerDataExtendedMessage()
                    msg.unpack(rawMsg,0)
                    msg.alterMsg()
                    rawMsg = msg.pack()
                    header.length = rawMsg.length
                break;
                case 42:
                    msg = new  SelectedServerDataMessage()
                    msg.unpack(rawMsg,0)
                    msg.alterMsg()
                    rawMsg = msg.pack()
                    header.length = rawMsg.length
                    break;
            }

            const rawPacket = Buffer.concat([header.toRaw(), rawMsg])
            var flushed = client.write(rawPacket);
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