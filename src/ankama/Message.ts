import { CustomDataWrapper } from "../network/CustomDataWraper";
export default abstract class Message{
    public protocolId:number = -1;
    constructor(id:number){
        this.protocolId=id
    }
    public abstract  unpack(data:Buffer, offset:number): CustomDataWrapper | null;
    public abstract  pack():Buffer;
    public abstract alterMsg():void;
    public abstract toString():string;
}