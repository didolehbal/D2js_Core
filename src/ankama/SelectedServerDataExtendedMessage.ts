import SelectedServerDataMessage from "./SelectedServerDataMessage";
import { CustomDataWrapper } from "../network/CustomDataWraper";
import GameServerInformations from "./GameServerInformations";
export default class SelectedServerDataExtendedMessage extends SelectedServerDataMessage {
    public static protocolId: number = 6469;
    public _servers: GameServerInformations[]

    constructor() {
        super(6469)
        this._servers = new Array<GameServerInformations>()
    }

    public pack = (): Buffer => {
        let bf: Buffer = super.pack();

        let dataWrapper = new CustomDataWrapper(Buffer.alloc(0))
        dataWrapper.writeShort(this._servers.length);

        let bff = dataWrapper.getBuffer()

        for (var _i1: number = 0; _i1 < this._servers.length; _i1++) {
            bff = Buffer.concat([bff, this._servers[_i1].pack()])
        }
        return Buffer.concat([bf, bff])
    }

    public unpack = (data: Buffer, offset: number): CustomDataWrapper | null => {
        let dataWrapper = super.unpack(data, offset)
        if (dataWrapper != null) {
            let serversLen = dataWrapper.readUnsignedShort()
            let _item: GameServerInformations
            for (let i = 0; i < serversLen; i++) {
                _item = new GameServerInformations();
                _item.unpack(dataWrapper);
                this._servers.push(_item)
            }

        }
        return dataWrapper
    }
    
}