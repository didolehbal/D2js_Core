import { Socket } from "net";
import PacketHandler from "./PacketHandler"

export default class SockerHandler {
    private src: Socket;
    private dest: Socket;
    private name:string;
    constructor(src: Socket, dest: Socket, name:string) {
        this.src = src;
        this.dest = dest;
        this.name = name;
        this.start();
    }
    private handlePacket(data: Buffer | null){
        if(data){
            let offset = 0;
            let serversLength = data.readUIntBE(0,2)
            offset+=2

         let _box0:number = data.readUIntBE(offset,1);

         let isMonoAccount = BooleanByteWrapper.getFlag(_box0,0);

         this.isSelectable = BooleanByteWrapper.getFlag(_box0,1);

      


        }
    }
    private start() {
        const { dest, src } = this;


        src.on("data", (data) => {
            const {name}=this
            var flushed = dest.write(data);
            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
            if(name == "CLIENT") return;
            let buffIndex = 0;
            let buffLength = data.length
            while(buffIndex < buffLength - 1){
                const header = data.readIntBE(buffIndex, 2);
                let packetId = header >> 2;
                let lenType = header & 3;
    
                let length = 0
                let body = null
                let offset = buffIndex + 2 + lenType
    
                if(lenType > 0){
                    length = data.readIntBE(buffIndex + 2, lenType)
                    body = data.slice(offset, offset + length)                 
                }
                //handle packet
                if(packetId === 6469)
                    this.handlePacket(body)
                console.log({ packetId, lenType, length})
                buffIndex = offset + length
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