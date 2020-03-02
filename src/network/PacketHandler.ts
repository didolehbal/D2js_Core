import Message from "../ankama/Message";
import Header from "./Header"

export default class PacketHandler {

    private _name: string;
    private _messagesToHandle: Message[];
    constructor(name: string, messagesToHandle: Message[]) {
        this._name = name;
        this._messagesToHandle = messagesToHandle
    }



    public extractPacket = (data: Buffer, offset: number): ExtractPacket => {

        const header = Header.fromRaw(data)
        const nextOffset = header.headerByteLength()

        let nextPacketOffset = nextOffset + header.length
        let rawPacket: Buffer = data.slice(offset, nextPacketOffset)

        if (rawPacket.length < header.length) {
            console.log(`packet ${header.packetID} length mismatch :  raw ${rawPacket.length} !=  header ${header.length}`)
        }

          this._messagesToHandle.map(msg => {
              if (msg.protocolId === header.packetID) {
  
                  msg.unpack(data, nextOffset) // we unpack the packet and put its state into msg
  
                  console.log(this._name, msg.toString())
  
                  msg.alterMsg()
  
                  console.log("after alter", this._name, msg.toString())
  
                  let rawBody = msg.pack(); // here we convert it to raw
  
                  header.length = rawBody.length; // this calls setter

                  let rawHead = header.toRaw()  // here we change body length in header
  
                  rawPacket = Buffer.concat([rawHead, rawBody])
                  nextPacketOffset = rawHead.length + rawBody.length
              }
          })
          

        return { header, offset: nextPacketOffset, rawPacket }
    }

    public processChunk = (data: Buffer): Buffer => {
        let offset = 0
        let procssedData: Buffer = Buffer.alloc(0)
        try {
            while (offset < data.length) {
                const { header, offset: nextOffset, rawPacket } = this.extractPacket(data, offset)
                console.log({header})
                offset = nextOffset
                procssedData = Buffer.concat([procssedData, rawPacket])
            }
        } catch (ex) {
            console.trace(ex)
            procssedData = data
        }
        return procssedData
    }
}

interface ExtractPacket {
    rawPacket: Buffer,
    header : Header
    offset: number
}