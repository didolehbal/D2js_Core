"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler = /** @class */ (function () {
    function PacketHandler(name, messagesToHandle) {
        var _this = this;
        this.unpackHeader = function (data, offset) {
            var header = data.readIntBE(offset, 2);
            var packetId = header >> 2;
            var lenType = header & 3;
            var length = 0;
            if (lenType > 0) {
                length = data.readIntBE(offset + 2, lenType);
            }
            return { header: { packetId: packetId, lenType: lenType, length: length }, offset: offset + 2 + lenType };
        };
        this.packHeader = function (packetId, length) {
            var rawHeader = Buffer.alloc(0);
            var headBff = Buffer.alloc(2);
            var lenType = 0;
            for (var b = length; b != 0; b = b >>> 8)
                lenType++;
            if (lenType > 3)
                throw Error("lentype Exceeded 3");
            headBff.writeUInt16BE((packetId << 2) + lenType, 0);
            rawHeader = Buffer.concat([rawHeader, headBff]);
            if (lenType > 0) {
                var lengthBff = Buffer.alloc(lenType);
                lengthBff.writeIntBE(length, 0, lenType);
                rawHeader = Buffer.concat([rawHeader, lengthBff]);
            }
            return rawHeader;
        };
        this.extractPacket = function (data, offset) {
            var _a = _this.unpackHeader(data, offset), header = _a.header, newOffset = _a.offset;
            var rawPacket = data.slice(offset, offset + header.length);
            _this._messagesToHandle.map(function (msg) {
                if (msg.protocolId == header.packetId) {
                    msg.unpack(data, newOffset); // we unpack the packet and put its state into msg
                    console.log(_this._name, msg.toString());
                    msg.alterMsg();
                    console.log("after alter", _this._name, msg.toString());
                    var bodybuff = msg.pack(); // here we convert it to raw
                    var rawHead = _this.packHeader(header.packetId, bodybuff.length); // here we change body length in header
                    rawPacket = Buffer.concat([rawHead, bodybuff]);
                }
            });
            var packet = { header: header };
            return { packet: packet, offset: newOffset + header.length, rawPacket: rawPacket };
        };
        this.processChunk = function (data) {
            var offset = 0;
            var buffLength = data.length;
            var procssedData = Buffer.alloc(0);
            try {
                while (offset < buffLength) {
                    var _a = _this.extractPacket(data, offset), newOffset = _a.offset, packet = _a.packet, rawPacket = _a.rawPacket;
                    offset = newOffset;
                    procssedData = Buffer.concat([procssedData, rawPacket]);
                    console.log(packet);
                }
            }
            catch (ex) {
                console.log(ex);
            }
            return procssedData;
        };
        this._name = name;
        this._messagesToHandle = messagesToHandle;
    }
    return PacketHandler;
}());
exports.default = PacketHandler;
