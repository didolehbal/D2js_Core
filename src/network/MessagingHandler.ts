import Header from "../utils/Header"
import { factory } from "../utils/Logger"
import { deserialize, serialize } from "../utils/Protocol"
import {MsgAction} from "../redux/types"
import CustomDataWrapper from "../utils/CustomDataWraper"

export default class MessagingHandler {

    private message: MsgAction | null = null;
    private offset: number = 0
    private buffer: Buffer = Buffer.alloc(0);
    private currentHeader: Header | null = null
    public msgsActions: MsgAction[];
    private log: any
    private isClient: boolean;
    private offsetInstanceID: number = 0
    private sendToClient: Function;
    private sendToServer: Function;

    constructor(msgsActions: MsgAction[], isClient: boolean, sendToServer: Function, sendToClient: Function) {
        this.sendToServer = sendToServer;
        this.sendToClient = sendToClient;
        this.msgsActions = msgsActions
        this.isClient = isClient
        this.log = factory.getLogger(isClient ? "Client" : "Server");
    }


    public reset() {
        this.message = null;
        this.offset = 0;
        this.buffer = Buffer.alloc(0)
        this.currentHeader = null;
    }

    public processChunk = (data: Buffer): Buffer => {

        let { isClient } = this
        const headers: Header[] = []

        this.offset = 0

        // append data to buffer
        this.buffer = Buffer.concat([this.buffer, data])

        do {
            // read new header if we're at the beggining of a new msg
            if (!this.currentHeader) {
                //read header from buff
                this.currentHeader = Header.fromRaw(this.buffer, isClient)
                //if insufficient data in buffer end
                if (!this.currentHeader) {
                    break;
                }
              
                if (isClient && Header.Global_InstanceID != this.currentHeader.instanceID) {
                    Header.GLOBAL_INSTANCE_ID = this.currentHeader.instanceID
                }

               this.log.debug(this.currentHeader.toString())

                //check if this message is to alter
                for (let i = 0; i < this.msgsActions.length; i++)
                    if (this.currentHeader.protocolID === this.msgsActions[i].protocolId) {
                        this.message = this.msgsActions[i]
                        break;
                    }


                //remove raw header from buffer (2 is for hi-header)
                this.buffer = this.buffer.slice(this.currentHeader.headerLength);

                //push header to list of header to log it
                headers.push(this.currentHeader)
            }

            // if buffer contains whole msg then
            if (this.buffer.length >= this.currentHeader.bodyLength) {
                //update msg raw data
                //raw message unmodified
                let rawMessage = this.buffer.slice(0, this.currentHeader.bodyLength)
                
               /* if(this.currentHeader.name=="GameRolePlayPlayerFightRequestMessage"){
                    console.log("GameRolePlayPlayerFightRequestMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex"))
                    let msgContent = deserialize(new CustomDataWrapper(rawMessage), this.currentHeader.name)
                    console.log({msgContent})
                }
                if(this.currentHeader.name=="ObjectUseMessage"){
                    console.log("ObjectUseMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex"))
                    let msgContent = deserialize(new CustomDataWrapper(rawMessage), this.currentHeader.name)
                    console.log({msgContent})
                }*/
            /* if(this.currentHeader.name=="GameRolePlayShowActorMessage")
                    console.log("GameRolePlayShowActorMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex"))
            if(this.currentHeader.name=="SequenceNumberMessage")
                    console.log("SequenceNumberMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex")) 
              */
                    /* if(this.currentHeader.name=="SequenceNumberMessage")
                    console.log("SequenceNumberMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex"))
                if(this.currentHeader.name=="ExchangePlayerRequestMessage")
                    console.log("ExchangePlayerRequestMessage",this.currentHeader.toRaw().toString("hex")+rawMessage.toString("hex"))
                if(this.currentHeader.name=="RawDataMessage"){
                    fs.writeFile("rdm.swf",rawMessage,(err)=>{
                        if(err) console.log("ERRR")
                        console.log("RawDataMessage")

                    })
                }*/
               
                
                if (this.message) {
                    
                    let msgContent = deserialize(new CustomDataWrapper(rawMessage), this.currentHeader.name)
                    if (this.message.doInBackground != null)
                        this.message.doInBackground(msgContent)


                    if (this.message.alter != null) {
                        this.message.alter(msgContent)
                        rawMessage = serialize(new CustomDataWrapper(), msgContent, this.currentHeader.name)
                        let newHeader: Header

                        if (isClient)
                            newHeader = new Header(this.currentHeader.protocolID,
                                rawMessage.length,
                                this.currentHeader.instanceID + this.offsetInstanceID)
                        else
                            newHeader = new Header(this.currentHeader.protocolID,
                                rawMessage.length)

                        data = Buffer.concat([
                            data.slice(0, this.offset),
                            newHeader.toRaw(), rawMessage,
                            data.slice(this.offset + this.currentHeader.bodyLength + this.currentHeader.headerLength)])
                    }
                    this.message = null
                }

                this.offset += this.currentHeader.bodyLength + this.currentHeader.headerLength

                // remove old msg content starting of the index of the next msg
                this.buffer = this.buffer.slice(this.currentHeader.bodyLength)
                //reset header to null
                this.currentHeader = null;

            }
        } while (this.currentHeader == null && this.buffer.length > 0); // repeat while buffer is not empty and old msg ended


        return data
    }
}
