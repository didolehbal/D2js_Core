import Header from "./Header"
import CustomDataWrapper from "./CustomDataWraper"

export default class ServerHeader extends Header {

    constructor(protocolID: number, bodyLength: number) {
        super(protocolID, bodyLength)

    }

    get headerLength(): number {
        return 2 + this._lenType
    }

    public toRaw(): Buffer {

        let dw = new CustomDataWrapper()
        if (this._lenType > 3)
            throw Error("lentype Exceeded 3")

        dw.writeShort(this._protocolID << 2 | this._lenType)

        if (this._lenType > 0) {
            let bodyLengthBff = Buffer.alloc(this._lenType)
            bodyLengthBff.writeIntBE(this._bodyLength, 0, this._lenType)
            dw.writeBytes(bodyLengthBff)
        }

        return dw.getBuffer();
    }




    public static fromRaw = (data: Buffer): Header | null => {

        if (data.length < 2)
            return null

        let dw = new CustomDataWrapper(data)

        const hiHeader = dw.readUnsignedShort()
        const protocolID = hiHeader >> 2
        const lenType = hiHeader & 3

        if (lenType > 3 || lenType < 0) {
            throw new Error("Invalide LenType value : " + lenType)
        }

        if (data.length < 2 + lenType)
            return null


        let bodyLength = 0
        if (lenType > 0) {
            bodyLength = data.readUIntBE(2, lenType)
        }

        return new ServerHeader(protocolID, bodyLength);
    }

}