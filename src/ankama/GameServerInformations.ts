import Message from "./Message";
import { CustomDataWrapper } from "../network/CustomDataWraper";
import { BooleanByteWrapper } from "../network/BooleanByteWrapper";


export default class GameServerInformations extends Message{
    public static protocolId:number = 25;
    public id:number = 0;
    public type:number = -1;
    public isMonoAccount:boolean = false;
    public status:number = 1;
    public completion:number = 0;
    public isSelectable:boolean = false;
    public charactersCount:number = 0;
    public charactersSlots:number = 0;
    public date:number = 0;
    constructor(id:number){
        super(id);
    }
    public  unpack(data:Buffer, offset:number): CustomDataWrapper | null{
        let dataWrapper = null;
        if (data) {
            let dataWrapper = new CustomDataWrapper(data.slice(offset))
            var _box0:number = dataWrapper.readByte();
            this.isMonoAccount = BooleanByteWrapper.getFlag(_box0,0);
            this.isSelectable = BooleanByteWrapper.getFlag(_box0,1);
            
            this.id = dataWrapper.readVarUhShort();
            if(this.id < 0)
             {
            throw new Error("Forbidden value (" + this.id + ") on element of GameServerInformations.id.");
             }

             this.type = dataWrapper.readByte();

             this.status = dataWrapper.readByte();

             if(this.status < 0)
    
             {
    
                throw new Error("Forbidden value (" + this.status + ") on element of GameServerInformations.status.");
    
             }
             this.completion = dataWrapper.readByte();

         if(this.completion < 0)

         {

            throw new Error("Forbidden value (" + this.completion + ") on element of GameServerInformations.completion.");

         }

        }
        return dataWrapper
    };
    public  pack():Buffer{
        let dataWrapper = new CustomDataWrapper(Buffer.alloc(0))

        return dataWrapper.getBuffer()
    };
    public  alterMsg():void{

    };
    public  toString():string{

    };
}