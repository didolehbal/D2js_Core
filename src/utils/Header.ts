import { Socket } from "net"
import {getMsgFromId} from "./Protocol"


export default class Header {
    private _packetID: number;
    private _lenType: number =0;
    private _length: number =0;
    private _name: string;
    constructor(packetID: number, length: number) {
        this._packetID = packetID;
        this.length = length;
        this._name = getMsgFromId[this._packetID]?.name
    }

    get packetID(): number {
        return this._packetID;
    }
    get lenType(): number {
        return this._lenType;
    }
    get length(): number {
        return this._length
    }
    get name():string{
        return this._name
    }

    set packetID(id: number) {
        this._packetID = id
    }

    set length(length: number) {
        if (length < 0)
            throw new Error("negative length is forbidden")
        this._length = length;

        this._lenType = this.lengthTypeFromLength(length);
    }

    public static fromRaw = (data: Buffer, offset = 0): Header => {
        const header = data.readIntBE(offset, 2);
        let packetID = header >> 2;
        let lenType = header & 3;

        let length = 0
        if (lenType > 0) {
            length = data.readUIntBE(offset + 2, lenType)
        }

        return new Header(packetID, length);
    }

    public toRaw(): Buffer {
        let rawHeader = Buffer.alloc(0)
        let headBff = Buffer.alloc(2)

        if (this._lenType > 3)
            throw Error("lentype Exceeded 3")

        headBff.writeInt16BE(this._packetID << 2 | this._lenType, 0)
        rawHeader = Buffer.concat([rawHeader, headBff])

        if (this._lenType > 0) {
            let lengthBff = Buffer.alloc(this._lenType)
            lengthBff.writeIntBE(this._length, 0, this._lenType)
            rawHeader = Buffer.concat([rawHeader, lengthBff])
        }
        return rawHeader;
    }

    private lengthTypeFromLength(length: number): number {
        if (length > 65535) {
            return 3;
        }
        if (length > 255) {
            return 2;
        }
        if (length > 0) {
            return 1;
        }
        return 0;
    }

    public headerByteLength(): number {
        return 2 + this._lenType
    }

    public static HeaderFromStream(socket: Socket): Header | null {
        const rawHiHeader: Buffer = socket.read(2)
        if (!rawHiHeader)
            return null;

        const hiHeader = rawHiHeader.readUInt16BE(0)
        const packetID = hiHeader >> 2
        const lenType = hiHeader & 3

        if (lenType > 3 || lenType < 0) {
            throw new Error("Invalide LenType value : " + lenType)
        }

        let rawLength: Buffer = Buffer.alloc(0)
        let length = 0
        if (lenType > 0) {
            rawLength = socket.read(lenType)
            if (!rawLength) {
                socket.unshift(rawHiHeader)
                return null;
            }
            length = rawLength.readUIntBE(0, lenType)
        }

        const header = new Header(packetID, length)
        return header;
    }

    public toString():string{
        return `===== packet name ${this._name} id ${this.packetID} length ${this.length} ======`
    }
    public static HeaderFromBuffer(data: Buffer): Header | null {
        if (data.length < 2)
            return null
        const hiHeader = data.readUInt16BE(0)
        const packetID = hiHeader >> 2
        const lenType = hiHeader & 3

        if (lenType > 3 || lenType < 0) {
            throw new Error("Invalide LenType value : " + lenType)
        }

        if (data.length < 2 + lenType)
            return null

        let length = 0
        if (lenType > 0) {
            length = data.readUIntBE(2, lenType)
        }

        const header = new Header(packetID, length)
        return header;
    }
}