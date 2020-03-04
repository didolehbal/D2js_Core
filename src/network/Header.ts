
export default class Header {
    private _packetID: number;
    private _lenType: number;
    private _length: number;

    constructor(packetID: number, lenType: number, length: number) {
        this._packetID = packetID;
        this._lenType = lenType;
        this._length = length;
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
            length = data.readIntBE(offset + 2, lenType)
        }

        return new Header(packetID, lenType, length);
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
}