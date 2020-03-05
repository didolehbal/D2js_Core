import Message from "../ankama/Message";
import Header from "./Header"

export default class PacketHandler {

    private offset: number = 0;
    private buffer: Buffer = Buffer.alloc(0);
    private currentHeader: Header | null = null

    constructor() {
    }




    public processChunk = (data: Buffer): Header[] => {
        // append data to buffer
        const headers: Header[] = []
        this.buffer = Buffer.concat([this.buffer, data])
        do {
            // if we're at the beggining of a new msg
            if (!this.currentHeader) {
                //read header from buff
                this.currentHeader = Header.HeaderFromBuffer(this.buffer)
                if (!this.currentHeader){
                    return headers
                }
                headers.push(this.currentHeader)
                //remove raw header from buffer (2 is for hi-header)
                this.buffer = this.buffer.slice(this.currentHeader.lenType + 2);
            }
            // if buffer contains whole msg then
            if (this.buffer.length >= this.currentHeader.length) {
                // remove old msg content starting of the index of the next msg
                this.buffer = this.buffer.slice(this.currentHeader.length)
                //reset header to null
                this.currentHeader = null;
            }
        } while (this.currentHeader == null && this.buffer.length > 0); // repeat while buffer is not empty and old msg ended
        return headers
    }
}

interface ExtractPacket {
    rawPacket: Buffer,
    header: Header
    offset: number
}