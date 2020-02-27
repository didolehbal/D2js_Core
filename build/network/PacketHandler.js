"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler = /** @class */ (function () {
    function PacketHandler(send) {
        this.send = send;
    }
    PacketHandler.prototype.handle = function (data) {
        var hiHeader = data.readUIntBE(0, 2);
        var packetId = hiHeader >> 2;
        var lenType = hiHeader & 3;
        this.send({ packetId: packetId, lenType: lenType });
        return { packetId: packetId, lenType: lenType };
    };
    ;
    return PacketHandler;
}());
exports.default = PacketHandler;
