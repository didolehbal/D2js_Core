"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SockerHandler = /** @class */ (function () {
    function SockerHandler(src, dest, packetHandler) {
        this.src = src;
        this.dest = dest;
        this.start();
        this.packetHandler = packetHandler;
    }
    SockerHandler.prototype.start = function () {
        var _a = this, dest = _a.dest, src = _a.src, packetHandler = _a.packetHandler;
        src.on("data", function (data) {
            var flushed = dest.write(data);
            var hiHeader = data.readUIntBE(0, 2);
            var packetId = hiHeader >> 2;
            var lenType = hiHeader & 3;
            console.log({ packetId: packetId, lenType: lenType });
            if (!flushed) {
                console.log("  remote not flushed; pausing local");
                dest.pause();
            }
        });
        src.on('drain', function () {
            dest.resume();
        });
        src.on('close', function (had_error) {
            dest.end();
        });
    };
    return SockerHandler;
}());
exports.default = SockerHandler;
