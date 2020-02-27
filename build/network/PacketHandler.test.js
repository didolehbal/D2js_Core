"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler_1 = __importDefault(require("./PacketHandler"));
var packetHandler = new PacketHandler_1.default(function () { return console.log("handled !"); });
test('should have id', function () {
    var data = [0, 0x12];
    var buffer = new Buffer(data);
    console.log(buffer.toString());
    var result = packetHandler.handle(buffer);
    console.log(result);
    //expect(result.packetId).toEqual(0)
});
