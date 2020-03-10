import Header from "./utils/Header"
import { factory } from "./utils/Logger"
import {deserialize, serialize} from "./utils/Protocol"
import fs from "fs"

import {MsgAction} from "./types"
import CustomDataWrapper from "./utils/CustomDataWraper"
import { ConsoleLoggerImpl } from "typescript-logging"

export default class PacketHandler {

    private message: MsgAction | null = null;
    private offset: number = 0
    private buffer: Buffer = Buffer.alloc(0);
    private currentHeader: Header | null = null
    private msgsActions: MsgAction[];
    private log: any

    constructor(msgsActions: MsgAction[], name: string) {
        this.msgsActions = msgsActions
        this.log = factory.getLogger(name);

    }


    public reset(){
        this.message=null;
        this.offset = 0;
        this.buffer= Buffer.alloc(0)
        this.currentHeader =null;
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
                for (let i = 0; i < this.msgsActions.length; i++)
                    if (this.currentHeader.packetID === this.msgsActions[i].protocolId) {
                        this.message = this.msgsActions[i]
                        console.log("msg found")
                    }

                //push header to list of header to log it
                headers.push(this.currentHeader)
                //remove raw header from buffer (2 is for hi-header)
                this.buffer = this.buffer.slice(this.currentHeader.lenType + 2);
            }

            // if buffer contains whole msg then
            if (this.buffer.length >= this.currentHeader.length) {
                //updata msg raw data
                if (this.message) {
                    //raw message unmodified
                    let rawMessage = this.buffer.slice(this.offset, this.offset + this.currentHeader.length + 2 + this.currentHeader.lenType)

                    let msgContent = deserialize(new CustomDataWrapper(rawMessage),this.currentHeader.name)
                    if(this.message.doInBackground != null)
                        this.message.doInBackground(msgContent)

                    if(this.message.alter != null)
                       this.message.alter(msgContent)
                    //raw message after modification
                    rawMessage = serialize(new CustomDataWrapper(),msgContent,this.currentHeader.name)

                    const newHeader = new Header(this.currentHeader.packetID, rawMessage.length)
                    
                    data = Buffer.concat([
                        data.slice(0, this.offset),
                        newHeader.toRaw(), rawMessage,
                        data.slice(this.offset + this.currentHeader.length + 2 + this.currentHeader.lenType)])

                    this.message = null
                }
                else
                    this.offset += this.currentHeader.length + 2 + this.currentHeader.lenType
                
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