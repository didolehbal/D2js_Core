import { Socket } from "net";
import Message from "../ankama/Message";
import DofusSocket from "./DofusSocket"
import SelectedServerDataExtendedMessage from "../ankama/SelectedServerDataExtendedMessage";
import SelectedServerDataMessage from "../ankama/SelectedServerDataMessage";
import PROTOCOL from "./protocol.json"

const msg_from_id = PROTOCOL.msg_from_id as Anything
interface Anything {
    [key: string]: any;
  }

export default class SocketHandler {
    private client: Socket;
    private server: DofusSocket;
    private _MessagesToHandle: Message[]
    
    constructor(client: Socket, server: Socket, messagesToHandle: Message[]) {
        this.client = client;
        this.server = new DofusSocket(server);
        this._MessagesToHandle = messagesToHandle
    }

    public sendToClient = (data:Buffer) => {
        let flushed = this.client.write(data);
        if (!flushed) {
            console.log("/!\ client not flushed; pausing local");
            this.server.pause();
        }
    }

    public sendToServer = (data:Buffer) => {
        let flushed = this.server.write(data);
        if (!flushed) {
            console.log("/!\ server not flushed; pausing local");
            this.client.pause();
        }
    }

    public start = () => {
        const { server, client } = this;
        client.on("data", (data) => {
            this.sendToServer(data)
        })

        server.on("data", ({header,rawMsg, restOfMsg}) => {

            if(restOfMsg){
                this.sendToClient(restOfMsg)
                return
            }

            const packetName:any = msg_from_id[header.packetID]?.name

            console.log(`===== packet name ${packetName} id ${header.packetID} length ${header.length} ======` )

            let msg :Message
            switch(header.packetID){
                case SelectedServerDataExtendedMessage.protocolId:
                    msg= new  SelectedServerDataExtendedMessage()
                    msg.unpack(rawMsg,0)
                    msg.alterMsg()
                    rawMsg = msg.pack()
                    header.length = rawMsg.length
                break;
                case SelectedServerDataMessage.protocolId:
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