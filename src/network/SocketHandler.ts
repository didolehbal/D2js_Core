import { Socket } from "net";
import PacketHandler from "./PacketHandler"

export default class SockerHandler {
    private src: Socket;
    private dest: Socket;
    private packetHandler : PacketHandler;
    constructor(src: Socket, dest: Socket, packetHandler: PacketHandler) {
        this.src = src;
        this.dest = dest;
        this.start();
        this.packetHandler = packetHandler;
    }
    private start() {
        const { dest, src, packetHandler } = this;
        
        src.on("data", (data) => {
            var flushed = dest.write(data);

            packetHandler.handle(data);

            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
        })

        src.on('drain', function () {
            dest.resume();
        });

        src.on('close', function (had_error) {
            dest.end();
        });
    }
}