"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SockerHandler = /** @class */ (function () {
    function SockerHandler(src, dest, name) {
        this.src = src;
        this.dest = dest;
        this.name = name;
        this.start();
    }
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
