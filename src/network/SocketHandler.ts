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

        let buff:Buffer;

        src.on("data", (data) => {
            var flushed = dest.write(data);
            buff = Buffer.concat([buff,data])
            const hiHeader = data.readUIntBE(0,2);
            let packetId = hiHeader >> 2;
            let lenType = hiHeader & 3;
            console.log({packetId,lenType})

            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
        })

        src.on('drain', function () {
            dest.resume();
        });

        src.on('close', function (had_error) {
            console.log("disconected")
            dest.end();
        });
    }
}