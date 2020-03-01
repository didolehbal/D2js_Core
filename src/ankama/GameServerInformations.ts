import Message from "./Message";
import { CustomDataWrapper } from "../network/CustomDataWraper";
import { BooleanByteWrapper } from "../network/BooleanByteWrapper";


export default class GameServerInformations  {
    public static protocolId: number = 25;
    public id: number = 0;
    public type: number = -1;
    public isMonoAccount: boolean = false;
    public status: number = 1;
    public completion: number = 0;
    public isSelectable: boolean = false;
    public charactersCount: number = 0;
    public charactersSlots: number = 0;
    public date: number = 0;
    
    public unpack(dataWrapper: CustomDataWrapper): CustomDataWrapper | null {
        if (dataWrapper) {
            var _box0: number = dataWrapper.readByte();
            this.isMonoAccount = BooleanByteWrapper.getFlag(_box0, 0);
            this.isSelectable = BooleanByteWrapper.getFlag(_box0, 1);

            this.id = dataWrapper.readVarUhShort();
            if (this.id < 0) {
                throw new Error("Forbidden value (" + this.id + ") on element of GameServerInformations.id.");
            }

            this.type = dataWrapper.readByte();

            this.status = dataWrapper.readByte();

            if (this.status < 0) {
                throw new Error("Forbidden value (" + this.status + ") on element of GameServerInformations.status.");
            }
            this.completion = dataWrapper.readByte();
            if (this.completion < 0) {
                throw new Error("Forbidden value (" + this.completion + ") on element of GameServerInformations.completion.");
            }
            this.charactersCount = dataWrapper.readByte();
            if (this.charactersCount < 0) {
                throw new Error("Forbidden value (" + this.charactersCount + ") on element of GameServerInformations.charactersCount.");
            }
            this.charactersSlots = dataWrapper.readByte();
            if (this.charactersSlots < 0) {
                throw new Error("Forbidden value (" + this.charactersSlots + ") on element of GameServerInformations.charactersSlots.");
            }
            this.date = dataWrapper.readDouble();
            if (this.date < -9007199254740990 || this.date > 9007199254740990) {
                throw new Error("Forbidden value (" + this.date + ") on element of GameServerInformations.date.");
            }

        }
        return dataWrapper
    };
    public pack(): Buffer {
        let dataWrapper = new CustomDataWrapper(Buffer.alloc(0))

        var _box0: number = 0;
        _box0 = BooleanByteWrapper.setFlag(_box0, 0, this.isMonoAccount);
        _box0 = BooleanByteWrapper.setFlag(_box0, 1, this.isSelectable);
        dataWrapper.writeByte(_box0)

        if (this.id < 0) {
            throw new Error("Forbidden value (" + this.id + ") on element id.");
        }
        dataWrapper.writeVarShort(this.id);
        dataWrapper.writeByte(this.type);
        dataWrapper.writeByte(this.status);
        dataWrapper.writeByte(this.completion);
        if(this.charactersCount < 0)
        {
           throw new Error("Forbidden value (" + this.charactersCount + ") on element charactersCount.");
        }
        dataWrapper.writeByte(this.charactersCount);
        if(this.charactersSlots < 0)
        {
           throw new Error("Forbidden value (" + this.charactersSlots + ") on element charactersSlots.");
        }
        dataWrapper.writeByte(this.charactersSlots);
        if(this.date < -9007199254740990 || this.date > 9007199254740990)
        {
           throw new Error("Forbidden value (" + this.date + ") on element date.");
        }
        dataWrapper.writeDouble(this.date);
        
        return dataWrapper.getBuffer()
    };
    public alterMsg(): void {

    };
    public toString(): string {
        return `id : ${this.id}`
    };
}