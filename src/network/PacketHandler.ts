import Message from "../ankama/Message";

export default class PacketHandler {

    private _name:string;
    private _messagesToHandle :Message[];
    constructor(name : string,messagesToHandle :Message[]) {
        this._name=name;
        this._messagesToHandle=messagesToHandle
    }
    private extractHeader = (data:Buffer, offset:number) =>{
        const header = data.readIntBE(offset, 2);
        let packetId = header >> 2;
        let lenType = header & 3;
        
        let length = 0
        if (lenType > 0) {
            length = data.readIntBE(offset + 2, lenType)
        }
        return {header:{packetId, lenType, length},offset: offset + 2 + lenType}

    }
    private extractPacket = (data:Buffer, offset:number) => {

        let {header, offset: newOffset} = this.extractHeader(data, offset);
        //get body of message  
        this._messagesToHandle.map(msg => {
            if(msg.protocolId == header.packetId){
                msg.unpack(data, newOffset)
                console.log(this._name, msg.toString())
            }
            else{
                console.log(this._name, header)
            }
        })
        return {header,offset: newOffset+ header.length }
    }
     public processChunk = (data:Buffer) : Buffer =>{
            let offset = 0;
            let buffLength = data.length
            try{
                while (offset < buffLength - 1) {
                    let {offset: newOffset} = this.extractPacket(data,offset)
                    offset = newOffset
                  }
            }catch(ex){
                console.log(ex)
            }
           
            return data
    }
}