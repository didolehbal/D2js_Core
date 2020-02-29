import { Socket } from "net";
import PacketHandler from "./PacketHandler"
import SelectedServerDataMessage from "../ankama/SelectedServerDataMessage"

export default class SocketHandler {
    private client: Socket;
    private server: Socket;

    constructor(client: Socket, server: Socket) {
        this.client = client;
        this.server = server;
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

            let selectedservData = new SelectedServerDataMessage()

            
            let packetHandler = new PacketHandler("Server",[selectedservData]);
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