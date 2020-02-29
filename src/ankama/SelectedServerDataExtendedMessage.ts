import SelectedServerDataMessage from "./SelectedServerDataMessage";
import { CustomDataWrapper } from "../network/CustomDataWraper";
export default class SelectedServerDataExtendedMessage extends SelectedServerDataMessage {
    public static protocolId:number = 6469;
    public _servers = []
    constructor(){
        super(6469)
    }
    public pack = ():Buffer => {
        let bf : Buffer = super.pack();
        
        return bf
    }
    public unpack = (data:Buffer, offset:number) : CustomDataWrapper | null  => {
         let dataWrapper = super.unpack(data, offset)
         if(dataWrapper){
            let serversLen = dataWrapper.readUnsignedShort()
            for(let i = 0; i < serversLen; i++)
                this._servers.push()
         }
         return dataWrapper
    }
}