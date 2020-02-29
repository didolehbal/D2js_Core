import { Socket } from "net";
import PacketHandler from "./PacketHandler"
import { BooleanByteWrapper } from "./BooleanByteWrapper"
import { CustomDataWrapper } from "./CustomDataWraper";

export default class SockerHandler {
    private src: Socket;
    private dest: Socket;
    private name: string;
    constructor(src: Socket, dest: Socket, name: string) {
        this.src = src;
        this.dest = dest;
        this.name = name;
        this.start();
    }
    private handlePacket(data: Buffer | null) {
        if (data) {
            let offset = 0;
            /*
            Decerliaze ONE gameServerInformations
            let serversLength = data.readUIntBE(0, 2)
            offset += 2

            let _box0: number = data.readUIntBE(offset, 1);
            offset += 1
            let isMonoAccount = BooleanByteWrapper.getFlag(_box0, 0);

            let isSelectable = BooleanByteWrapper.getFlag(_box0, 1);

            let dataWrapper = new CustomDataWrapper(data.slice(offset))

            let id = dataWrapper.readVarUhShort()
            if (id < 0) {
                throw new Error("Forbidden value (" + id + ") on element of GameServerInformations.id.");
            }

            let type = dataWrapper.readByte()

            let status = dataWrapper.readByte();
            if (status < 0) {
                throw new Error("Forbidden value (" + status + ") on element of GameServerInformations.status.");
            }

            let completion = dataWrapper.readByte();
            if (completion < 0) {
                throw new Error("Forbidden value (" + completion + ") on element of GameServerInformations.completion.");
            }

            let charactersCount = dataWrapper.readByte();
            if (charactersCount < 0) {
                throw new Error("Forbidden value (" + charactersCount + ") on element of GameServerInformations.charactersCount.");
            }

            let charactersSlots = dataWrapper.readByte();
            if (charactersSlots < 0) {
                throw new Error("Forbidden value (" + charactersSlots + ") on element of GameServerInformations.charactersSlots.");
            }

            let date = dataWrapper.readDouble();
            if (date < -9007199254740990 || date > 9007199254740990) {
                throw new Error("Forbidden value (" + date + ") on element of GameServerInformations.date.");
            }*/
            let dataWrapper = new CustomDataWrapper(data.slice(offset))
            let serverId = dataWrapper.readVarUhShort();
            let address = dataWrapper.readUTF();
            let portsLen = dataWrapper.readUnsignedShort();
            console.log(portsLen)
            let ports =[]
            for(let i =0; i<portsLen; i++){
                ports.push(dataWrapper.readInt())
            }
            console.log({serverId,address,portsLen,ports})

        }
    }
    private start() {
        const { dest, src } = this;


        src.on("data", (data) => {
            const { name } = this
            var flushed = dest.write(data);
            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
            if (name == "CLIENT") return;
            let buffIndex = 0;
            let buffLength = data.length
            while (buffIndex < buffLength - 1) {
                const header = data.readIntBE(buffIndex, 2);
                let packetId = header >> 2;
                let lenType = header & 3;

                let length = 0
                let body = null
                let offset = buffIndex + 2 + lenType

                if (lenType > 0) {
                    length = data.readIntBE(buffIndex + 2, lenType)
                    body = data.slice(offset, offset + length)
                }
                //handle packet
                if (packetId === 6469 || packetId === 42)
                    this.handlePacket(body)
                console.log({ packetId, lenType, length })
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