import Message from "./Message"
import { BooleanByteWrapper } from "../network/BooleanByteWrapper"
import { CustomDataWrapper } from "../network/CustomDataWraper";

export default class SelectedServerDataMessage extends Message {
      public static protocolId:number = 42;
      private _isInitialized:boolean = false;
      public serverId:number = 0;
      public address:string = "";
      public ports:number[];
      public canCreateNewCharacter:boolean = false;
      public tickets:number[];

      constructor(protocolId : number = 42 ){
        super(protocolId);
         this.ports = new Array<number>();
         this.tickets = new Array<number>();
      }

      public pack() : Buffer {
        let dataWrapper = new CustomDataWrapper(Buffer.alloc(0))

        dataWrapper.writeVarShort(this.serverId)
        dataWrapper.writeUTF(this.address) // CHANGE TO LOCALHOST
        dataWrapper.writeShort(this.ports.length)
        for(let i =0; i<this.ports.length; i++)
            dataWrapper.writeInt(this.ports[i])
        
        dataWrapper.writeBoolean(this.canCreateNewCharacter)
        dataWrapper.writeVarInt(this.tickets.length)
        for(let i =0; i<this.tickets.length; i++){
            dataWrapper.writeByte(this.tickets[i])
        }
        return dataWrapper.getBuffer()
      }

      public alterMsg =()=>{
        this.ports = [7778]
        this.address ="localhost"
      }

      public unpack (data:Buffer, offset:number) : CustomDataWrapper | null{
        let dataWrapper = null;
        if (data) {
            let dataWrapper = new CustomDataWrapper(data.slice(offset))
            this.serverId = dataWrapper.readVarUhShort();
            this.address = dataWrapper.readUTF();
            
            let portsLen = dataWrapper.readUnsignedShort();
            for(let i =0; i<portsLen; i++){
                this.ports.push(dataWrapper.readInt())
            }

            this.canCreateNewCharacter = dataWrapper.readBoolean()
        
            let ticketLen = dataWrapper.readVarInt();
            for(let i =0; i<ticketLen; i++){
                this.tickets.push(dataWrapper.readByte())
            }
        }
        return dataWrapper
      }

      public toString = ():string => {
          return `protocolID: ${this.protocolId} |serverId: ${this.serverId} 
          | address: ${this.address} | ports:${this.ports} | canCreateNewCharacter : ${this.canCreateNewCharacter} 
          | tickets : ${this.tickets}`
      }
}