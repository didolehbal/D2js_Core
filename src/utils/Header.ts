import { getMsgFromId } from "./Protocol"
import CustomDataWrapper from "./CustomDataWraper"

export default class Header {
    protected _protocolID: number;
    protected _lenType: number = 0;
    protected _bodyLength: number = 0;
    protected _name: string;
    protected _instanceID: number = 0;
    protected static GLOBAL_INSTANCE_ID: number = 0;
    private _isClient: boolean = false;
    constructor(protocolID: number, bodyLength: number, instanceID: number = 0) {
        this._protocolID = protocolID;
        this.bodyLength = bodyLength;
        this._name = getMsgFromId[this._protocolID]?.name
        if (instanceID != 0) {
            this._instanceID = instanceID
            this._isClient = true
        }
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

    get headerLength(): number {
        if (this._isClient)
            return 6 + this._lenType
        else
            return 2 + this._lenType
    }


    set protocolID(id: number) {
        this._protocolID = id
    }
    static get Global_InstanceID(): number {
        return this.GLOBAL_INSTANCE_ID
    }

    set bodyLength(bodyLength: number) {
        if (bodyLength < 0)
            throw new Error("negative bodyLength is forbidden")
        this._bodyLength = bodyLength;

        this._lenType = this.lenTypeFromBodyLength(bodyLength);
    }

    public toRaw(): Buffer {

        let dw = new CustomDataWrapper()
        if (this._lenType > 3)
            throw Error("lentype Exceeded 3")

        dw.writeShort(this._protocolID << 2 | this._lenType)

        if (this._isClient)
            dw.writeInt(this.instanceID)

        if (this._lenType > 0) {
            let bodyLengthBff = Buffer.alloc(this._lenType)
            bodyLengthBff.writeIntBE(this._bodyLength, 0, this._lenType)
            dw.writeBytes(bodyLengthBff)
        }

        return dw.getBuffer();
    }

    public static fromRaw = (data: Buffer, isClient: boolean): Header | null => {

        if (data.length < 6)
            return null

        let dw = new CustomDataWrapper(data)

        const hiHeader = dw.readUnsignedShort()
        const protocolID = hiHeader >> 2
        const lenType = hiHeader & 3

        if (lenType > 3 || lenType < 0) {
            throw new Error("Invalide LenType value : " + lenType)
        }

        if (data.length < 6 + lenType)
            return null

        let instanceID = 0
        if (isClient)
            instanceID = dw.readInt()

        let bodyLength = 0
        if (lenType > 0) {
            bodyLength = data.readUIntBE(6, lenType)
        }
        Header.incrementGID()
        return new Header(protocolID, bodyLength, instanceID);
    }


    static incrementGID() {
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