import { getMsgFromId } from "./Protocol"

export default abstract class Header  {
    protected _protocolID: number;
    protected _lenType: number = 0;
    protected _bodyLength: number = 0;
    protected _name: string;
    protected _instanceID: number = -1;
    protected static GLOBAL_INSTANCE_ID :number = 0;

    constructor(protocolID: number, bodyLength: number, instanceID: number = 0) {
        this._protocolID = protocolID;
        this.bodyLength = bodyLength;
        this._name = getMsgFromId[this._protocolID]?.name
        if(instanceID != 0)
            this._instanceID = instanceID
    }


    get protocolID(): number {
        return this._protocolID;
    }
    get instanceID(): number {
        return this._instanceID;
    }
    get lenType(): number {
        return this._lenType;
    }
    get bodyLength(): number {
        return this._bodyLength
    }
    
    get name(): string {
        return this._name
    }

    abstract get headerLength():number;

    set protocolID(id: number) {
        this._protocolID = id
    }
    static get Global_InstanceID():number{
        return this.GLOBAL_INSTANCE_ID
    }

    set bodyLength(bodyLength: number) {
        if (bodyLength < 0)
            throw new Error("negative bodyLength is forbidden")
        this._bodyLength = bodyLength;

        this._lenType = this.lenTypeFromBodyLength(bodyLength);
    }

    public abstract toRaw(): Buffer

    static incrementGID(){
        Header.GLOBAL_INSTANCE_ID += 1
    }
    private lenTypeFromBodyLength(bodyLength: number): number {
        if (bodyLength > 65535) {
            return 3;
        }
        if (bodyLength > 255) {
            return 2;
        }
        if (bodyLength > 0) {
            return 1;
        }
        return 0;
    }

    public toString(): string {
        return `packet name ${this._name} id ${this.protocolID} instanceID ${this.instanceID} GB ${Header.GLOBAL_INSTANCE_ID} bodyLength ${this.bodyLength}`
    }

}