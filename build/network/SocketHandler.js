"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var DofusSocket_1 = __importDefault(require("./DofusSocket"));
var SocketHandler = /** @class */ (function () {
    function SocketHandler(client, server, messagesToHandle) {
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
                console.log("===== new Chunk length " + data.length + " ======");
                //let packetHandler   = new PacketHandler("Server", this._MessagesToHandle);
                //let processedData = packetHandler.processChunk(data)
                var flushed = client.write(data);
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
            server.on('close', function (hadError) {
                console.log("disconected", hadError);
                client.end();
            });
        };
        this.client = client;
        this.server = new DofusSocket_1.default(server);
        this._MessagesToHandle = messagesToHandle;
    }
    return SocketHandler;
}());
exports.default = SocketHandler;
