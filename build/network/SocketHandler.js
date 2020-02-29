"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CustomDataWraper_1 = require("./CustomDataWraper");
var SockerHandler = /** @class */ (function () {
    function SockerHandler(src, dest, name) {
        this.src = src;
        this.dest = dest;
        this.name = name;
        this.start();
    }
    SockerHandler.prototype.handlePacket = function (data) {
        if (data) {
            var offset = 0;
            /*
            Decerliaze ONE gameServerInformations
            let serversLength = data.readUIntBE(0, 2)
            offset += 2

            let _box0: number = data.readUIntBE(offset, 1);
            offset += 1
            let isMonoAccount = BooleanByteWrapper.getFlag(_box0, 0);

            let isSelectable = BooleanByteWrapper.getFlag(_box0, 1);

            let dataWrapper = new CustomDataWrapper(data.slice(offset))

            let id = dataWrapper.readVarUhShort()
            if (id < 0) {
                throw new Error("Forbidden value (" + id + ") on element of GameServerInformations.id.");
            }

            let type = dataWrapper.readByte()

            let status = dataWrapper.readByte();
            if (status < 0) {
                throw new Error("Forbidden value (" + status + ") on element of GameServerInformations.status.");
            }

            let completion = dataWrapper.readByte();
            if (completion < 0) {
                throw new Error("Forbidden value (" + completion + ") on element of GameServerInformations.completion.");
            }

            let charactersCount = dataWrapper.readByte();
            if (charactersCount < 0) {
                throw new Error("Forbidden value (" + charactersCount + ") on element of GameServerInformations.charactersCount.");
            }

            let charactersSlots = dataWrapper.readByte();
            if (charactersSlots < 0) {
                throw new Error("Forbidden value (" + charactersSlots + ") on element of GameServerInformations.charactersSlots.");
            }

            let date = dataWrapper.readDouble();
            if (date < -9007199254740990 || date > 9007199254740990) {
                throw new Error("Forbidden value (" + date + ") on element of GameServerInformations.date.");
            }*/
            var dataWrapper = new CustomDataWraper_1.CustomDataWrapper(data.slice(offset));
            var serverId = dataWrapper.readVarUhShort();
            var address = dataWrapper.readUTF();
            console.log({ serverId: serverId, address: address });
        }
    };
    SockerHandler.prototype.start = function () {
        var _this = this;
        var _a = this, dest = _a.dest, src = _a.src;
        src.on("data", function (data) {
            var name = _this.name;
            var flushed = dest.write(data);
            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
            if (name == "CLIENT")
                return;
            var buffIndex = 0;
            var buffLength = data.length;
            while (buffIndex < buffLength - 1) {
                var header = data.readIntBE(buffIndex, 2);
                var packetId = header >> 2;
                var lenType = header & 3;
                var length = 0;
                var body = null;
                var offset = buffIndex + 2 + lenType;
                if (lenType > 0) {
                    length = data.readIntBE(buffIndex + 2, lenType);
                    body = data.slice(offset, offset + length);
                }
                //handle packet
                if (packetId === 6469 || packetId === 42)
                    _this.handlePacket(body);
                console.log({ packetId: packetId, lenType: lenType, length: length });
                buffIndex = offset + length;
            }
        });
        src.on('drain', function () {
            dest.resume();
        });
        src.on('close', function (had_error) {
            console.log("disconected");
            dest.end();
        });
    };
    return SockerHandler;
}());
exports.default = SockerHandler;
