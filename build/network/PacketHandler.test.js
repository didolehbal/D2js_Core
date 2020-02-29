"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler_1 = __importDefault(require("./PacketHandler"));
test('pack unpack header', function () {
    var header = {
        packetId: 45,
        length: 0
    };
    var packetHandler = new PacketHandler_1.default("test", []);
    var rawHead = packetHandler.packHeader(header.packetId, header.length);
    var unpacketHead = packetHandler.unpackHeader(rawHead, 0);
    expect(unpacketHead.header.packetId).toEqual(header.packetId);
    expect(unpacketHead.header.length).toEqual(header.length);
});
