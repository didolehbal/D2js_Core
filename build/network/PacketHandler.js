"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler = /** @class */ (function () {
    function PacketHandler(name, messagesToHandle) {
        var _this = this;
        this.extractHeader = function (data, offset) {
            var header = data.readIntBE(offset, 2);
            var packetId = header >> 2;
            var lenType = header & 3;
            var length = 0;
            if (lenType > 0) {
                length = data.readIntBE(offset + 2, lenType);
            }
            return { header: { packetId: packetId, lenType: lenType, length: length }, offset: offset + 2 + lenType };
        };
        this.extractPacket = function (data, offset) {
            var _a = _this.extractHeader(data, offset), header = _a.header, newOffset = _a.offset;
            //get body of message  
            _this._messagesToHandle.map(function (msg) {
                if (msg.protocolId == header.packetId) {
                    msg.unpack(data, newOffset);
                    console.log(_this._name, msg.toString());
                }
                else {
                    console.log(_this._name, header);
                }
            });
            return { header: header, offset: newOffset + header.length };
        };
        this.processChunk = function (data) {
            var offset = 0;
            var buffLength = data.length;
            try {
                while (offset < buffLength - 1) {
                    var newOffset = _this.extractPacket(data, offset).offset;
                    offset = newOffset;
                }
            }
            catch (ex) {
                console.log(ex);
            }
            return data;
        };
        this._name = name;
        this._messagesToHandle = messagesToHandle;
    }
    return PacketHandler;
}());
exports.default = PacketHandler;
