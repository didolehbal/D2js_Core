export default abstract class Message{
    public protocolId:number = -1;
    constructor(id:number){
        this.protocolId=id
    }
    public abstract  unpack(data:Buffer, offset:number):void;
    public abstract  pack():Buffer;
    public abstract toString():string;
}