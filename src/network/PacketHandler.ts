import Message from "../ankama/Message";

export default class PacketHandler {

    private _name: string;
    private _messagesToHandle: Message[];
    constructor(name: string, messagesToHandle: Message[]) {
        this._name = name;
        this._messagesToHandle = messagesToHandle
    }
    public unpackHeader = (data: Buffer, offset: number) => {
        const header = data.readIntBE(offset, 2);
        let packetId = header >> 2;
        let lenType = header & 3;

        let length = 0
        if (lenType > 0) {
            length = data.readIntBE(offset + 2, lenType)
        }
        return { header: { packetId, lenType, length }, offset: offset + 2 + lenType }

    }
    public packHeader = (packetId: number,length:number) : Buffer => {
        let rawHeader = Buffer.alloc(0)
        let headBff = Buffer.alloc(2)

        let lenType = 0
        for(let b=length ; b != 0 ; b = b >>> 8)
            lenType++;

        if(lenType >3)
            throw Error("lentype Exceeded 3")

        headBff.writeUInt16BE( (packetId << 2) + lenType ,0)
        rawHeader = Buffer.concat([rawHeader,headBff])

        if(lenType > 0){
            let lengthBff = Buffer.alloc(lenType)
            lengthBff.writeIntBE(length,0,lenType)
            rawHeader = Buffer.concat([rawHeader, lengthBff])
        }
        return rawHeader;
    }

    private extractPacket = (data: Buffer, offset: number) :ExtractPacket => {

        let { header, offset: newOffset } = this.unpackHeader(data, offset);

        let rawPacket:Buffer = data.slice(offset);

        this._messagesToHandle.map(msg => {
            if ( header.packetId == 6469 || msg.protocolId == header.packetId) {
                msg.unpack(data, newOffset) // we unpack the packet and put its state into msg

                console.log(this._name, msg.toString())
                msg.alterMsg()
                console.log("after alter", this._name, msg.toString())
                let bodybuff = msg.pack(); // here we convert it to raw
                let rawHead = this.packHeader(header.packetId,bodybuff.length) // here we change body length in header

                rawPacket = Buffer.concat([rawHead,bodybuff])
            }
            else {
                rawPacket = data
                console.log(this._name, header)
            }
        })
        const packet = {header}
        return { packet, offset: newOffset + header.length, rawPacket }
    }


    public processChunk = (data: Buffer): Buffer => {
        let offset = 0;
        let buffLength = data.length
        let procssedData = Buffer.alloc(0)
        try {
            while (offset < buffLength - 1) {
                let { offset: newOffset,packet,rawPacket } = this.extractPacket(data, offset)
                offset = newOffset
                procssedData = Buffer.concat([procssedData, rawPacket])
            }
        } catch (ex) {
            console.log(ex)
        }

        return procssedData
    }
}

interface ExtractPacket{
    rawPacket :Buffer,
    packet:Object,
    offset:number
}