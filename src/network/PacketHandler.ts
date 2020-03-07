import Message from "../ankama/Message";
import Header from "./Header"
import {factory} from "../utils/Logger"

import fs from "fs"


export default class PacketHandler {

    private message: Message | null = null;
    private offset: number = 0
    private buffer: Buffer = Buffer.alloc(0);
    private currentHeader: Header | null = null
    private messagesToAlter: Message[];
    private log:any
    private name :string

    constructor(messagesToAlter :Message[], name: string) {
        this.messagesToAlter = messagesToAlter
        this.name = name
        this.log = factory.getLogger(name);
        
    }




    public processChunk = (data: Buffer): Buffer => {
        const headers: Header[] = []

        this.offset = 0

        // append data to buffer
        this.buffer = Buffer.concat([this.buffer, data])

        do {
            // read new header if we're at the beggining of a new msg
            if (!this.currentHeader) {
                //read header from buff
                this.currentHeader = Header.HeaderFromBuffer(this.buffer)
                //if insufficient data in buffer end
                if (!this.currentHeader) {
                    break;
                }

                //check if this message is to alter
                for (let i = 0; i < this.messagesToAlter.length; i++)
                    if (this.currentHeader.packetID === this.messagesToAlter[i].protocolId) {
                        this.message = this.messagesToAlter[i]
                        console.log("msg found")
                    }
                //push header to list of header to log it
                headers.push(this.currentHeader)
                //remove raw header from buffer (2 is for hi-header)
                this.buffer = this.buffer.slice(this.currentHeader.lenType + 2);
            }

            // if buffer contains whole msg then
            if (this.buffer.length >= this.currentHeader.length) {
                //remove message from data to append it altered later
                if (this.message) {
                    //raw message unmodified
                    let rawMessage = data.slice(this.offset, this.offset + this.currentHeader.length + 2 + this.currentHeader.lenType)

                    this.message.unpack(rawMessage, this.currentHeader.lenType + 2)
                    this.message.alterMsg()
                    //raw message after modification
                    rawMessage = this.message.pack()

                    const newHeader = new Header(this.currentHeader.packetID, rawMessage.length)
                    data = Buffer.concat([
                        data.slice(0, this.offset),
                        newHeader.toRaw(), rawMessage,
                        data.slice(this.offset + this.currentHeader.length + 2 + this.currentHeader.lenType)])

                    this.message = null
                }
                else
                    this.offset += this.currentHeader.length + 2 + this.currentHeader.lenType
                if(this.currentHeader.packetID === 5632){
                    let rawMessage = data.slice(this.offset, this.offset + this.currentHeader.length + 2 + this.currentHeader.lenType)
                    fs.appendFile("log.txt",rawMessage.toString() + "\n",()=> this.log("append to fs logs"))
                }
                // remove old msg content starting of the index of the next msg
                this.buffer = this.buffer.slice(this.currentHeader.length)
                //reset header to null
                this.currentHeader = null;

            }
        } while (this.currentHeader == null && this.buffer.length > 0); // repeat while buffer is not empty and old msg ended


        //log the headers
        headers.map(h => this.log.debug(h.toString()))

        return data
    }
}

interface ExtractPacket {
    rawPacket: Buffer,
    header: Header
    offset: number
}