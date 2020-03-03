"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Header_1 = __importDefault(require("./Header"));
var PacketHandler = /** @class */ (function () {
    function PacketHandler(name, messagesToHandle) {
        var _this = this;
        this.extractPacket = function (data, offset) {
            var header = Header_1.default.fromRaw(data);
            var nextOffset = header.headerByteLength();
            var nextPacketOffset = offset + nextOffset + header.length;
            var rawPacket = data.slice(offset, nextPacketOffset);
            console.log({ offset: offset, nextPacketOffset: nextPacketOffset, rawLength: rawPacket.length });
            if (rawPacket.length < header.length) {
                console.log("packet " + header.packetID + " length mismatch :  raw " + rawPacket.length + " !=  header " + header.length);
            }
            _this._messagesToHandle.map(function (msg) {
                if (msg.protocolId === header.packetID) {
                    msg.unpack(data, nextOffset); // we unpack the packet and put its state into msg
                    console.log(_this._name, msg.toString());
                    msg.alterMsg();
                    console.log("after alter", _this._name, msg.toString());
                    var rawBody = msg.pack(); // here we convert it to raw
                    header.length = rawBody.length; // this calls setter
                    var rawHead = header.toRaw(); // here we change body length in header
                    rawPacket = Buffer.concat([rawHead, rawBody]);
                    nextPacketOffset = rawHead.length + rawBody.length;
                }
            });
            return { header: header, offset: nextPacketOffset, rawPacket: rawPacket };
        };
        this.processChunk = function (data) {
            var offset = 0;
            var procssedData = Buffer.alloc(0);
            try {
                while (offset < data.length) {
                    var _a = _this.extractPacket(data, offset), header = _a.header, nextOffset = _a.offset, rawPacket = _a.rawPacket;
                    console.log({ header: header });
                    offset = nextOffset;
                    procssedData = Buffer.concat([procssedData, rawPacket]);
                }
            }
            catch (ex) {
                console.trace(ex);
                procssedData = data;
            }
            return procssedData;
        };
        this._name = name;
        this._messagesToHandle = messagesToHandle;
    }
    return PacketHandler;
}());
exports.default = PacketHandler;
