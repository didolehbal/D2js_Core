"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PacketHandler_1 = __importDefault(require("./PacketHandler"));
var SelectedServerDataMessage_1 = __importDefault(require("../ankama/SelectedServerDataMessage"));
var SocketHandler = /** @class */ (function () {
    function SocketHandler(client, server) {
        var _this = this;
        this.start = function () {
            var _a = _this, server = _a.server, client = _a.client;
            client.on("data", function (data) {
                var flushed = server.write(data);
                if (!flushed) {
                    console.log(" server not flushed; pausing local");
                    server.pause();
                }
            });
            server.on("data", function (data) {
                var selectedservData = new SelectedServerDataMessage_1.default();
                var packetHandler = new PacketHandler_1.default("Server", [selectedservData]);
                var processedData = packetHandler.processChunk(data);
                var flushed = client.write(processedData);
                if (!flushed) {
                    console.log(" client not flushed; pausing local");
                    server.pause();
                }
            });
            client.on('drain', function () {
                server.resume();
            });
            client.on('close', function (had_error) {
                console.log("disconected");
                server.end();
            });
            server.on('drain', function () {
                client.resume();
            });
            server.on('close', function (had_error) {
                console.log("disconected");
                client.end();
            });
        };
        this.client = client;
        this.server = server;
    }
    return SocketHandler;
}());
exports.default = SocketHandler;
