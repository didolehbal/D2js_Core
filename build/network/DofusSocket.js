"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var Header_1 = __importDefault(require("./Header"));
var DofusSocket = /** @class */ (function (_super) {
    __extends(DofusSocket, _super);
    function DofusSocket(socket) {
        var _this = _super.call(this, { objectMode: true }) || this;
        _this._readingPaused = false;
        _this._socket = socket;
        _this._initSocket();
        return _this;
    }
    DofusSocket.prototype._initSocket = function () {
        var _this = this;
        this._socket.on('close', function (hadError) { return _this.emit('close', hadError); });
        this._socket.on('connect', function () { return _this.emit('connect'); });
        this._socket.on('drain', function () { return _this.emit('drain'); });
        this._socket.on('end', function () { return _this.emit('end'); });
        this._socket.on('error', function (err) { return _this.emit('error', err); });
        this._socket.on('lookup', function (err, address, family, host) { return _this.emit('lookup', err, address, family, host); }); // prettier-ignore
        this._socket.on('ready', function () { return _this.emit('ready'); });
        this._socket.on('timeout', function () { return _this.emit('timeout'); });
        this._socket.on('readable', this._onReadable.bind(this));
    };
    DofusSocket.prototype._onReadable = function () {
        while (!this._readingPaused) {
            var rawHiHeader = this._socket.read(2);
            if (!rawHiHeader)
                return;
            var hiHeader = rawHiHeader.readInt16BE(0);
            var packetID = hiHeader >> 2;
            var lenType = hiHeader & 3;
            var rawLength = Buffer.alloc(0);
            var length = 0;
            if (lenType > 0) {
                rawLength = this._socket.read(lenType);
                if (!rawLength) {
                    this._socket.unshift(rawHiHeader);
                    return;
                }
                length = rawLength.readIntBE(0, lenType);
            }
            var header = new Header_1.default(packetID, lenType, length);
            var rawMsg = this._socket.read(header.length);
            if (!rawMsg) {
                this._socket.unshift(Buffer.concat([rawHiHeader, rawLength]));
                return;
            }
            var rawPacket = Buffer.concat([header.toRaw(), rawMsg]);
            var pushOk = this.push(rawPacket);
            // pause reading if consumer is slow
            if (!pushOk)
                this._readingPaused = true;
            /*    const rawHeader: Buffer = this._socket.read(5)
                if (!rawHeader)
                    return;
    
                const header = Header.fromRaw(rawHeader)
    
                const howMuchLeftFromHeader = 5 - 2 - header.lenType
                const whatLeftFromHeader = rawHeader.slice(howMuchLeftFromHeader)
                const restOfRawMsg = this._socket.read(header.length - howMuchLeftFromHeader)
    
                if (!restOfRawMsg) {
                    this._socket.unshift(rawHeader)
                    return
                }
                const rawMsg = Buffer.concat([whatLeftFromHeader, restOfRawMsg])
    
                const rawPacket = Buffer.concat([header.toRaw(), rawMsg])
                let pushOk = this.push(rawPacket);
    
                // pause reading if consumer is slow
                if (!pushOk) this._readingPaused = true;*/
        }
    };
    DofusSocket.prototype._read = function () {
        this._readingPaused = false;
        setImmediate(this._onReadable.bind(this));
    };
    /*_write(msg: Message, encoding: string, cb: Function) {
 
        const rawMsg = msg.pack()
        const header = new Header(msg.protocolId, 0, 0)
        header.length = rawMsg.length
        this._socket.write(Buffer.concat([header.toRaw(), rawMsg]));
    }*/
    DofusSocket.prototype._final = function () {
        this._socket.end();
    };
    return DofusSocket;
}(stream_1.Duplex));
exports.default = DofusSocket;
