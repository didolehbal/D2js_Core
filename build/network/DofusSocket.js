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
var Socket = require('net').Socket;
var Duplex = require('stream').Duplex;
var DofusSocket = /** @class */ (function (_super) {
    __extends(DofusSocket, _super);
    /**
     DofusSocket implements a basic wire-protocol that encodes/decodes
     JavaScripts objects as JSON strings over the wire. The wire protocol
     is defined as:
      4   len  - length of JSON body
      len body - the JSON body encoded with minimal whitespacing
     DofusSocket operates in object mode where calls to `read` and `write`
     operate on JavaScript objects instead of Buffers.
     @param {Socket} socket
     */
    function DofusSocket(socket) {
        var _this = _super.call(this, { objectMode: true }) || this;
        /**
          True when read buffer is full and calls to `push` return false.
          Additionally data will not be read off the socket until the user
          calls `read`.
          @private
          @type {boolean}
         */
        _this._readingPaused = false;
        /**
          The underlying TCP Socket
          @private
          @type {Socket}
         */
        _this._socket;
        // wrap the socket
        if (socket)
            _this._wrapSocket(socket);
        return _this;
    }
    /**
      Connect to a DofusSocket server.
      @param {object} param
      @param {string} [param.host] the host to connect to. Default is localhost
      @param {number} param.port the port to connect to. Required.
      @return {DofusSocket}
     */
    DofusSocket.prototype.connect = function (_a) {
        var host = _a.host, port = _a.port;
        this._wrapSocket(new Socket());
        this._socket.connect({ host: host, port: port });
        return this;
    };
    /**
      Wraps a standard TCP Socket by binding to all events and either
      rebroadcasting those events or performing custom functionality.
      @private
      @param {Socket} socket
     */
    DofusSocket.prototype._wrapSocket = function (socket) {
        var _this = this;
        this._socket = socket;
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
    /**
      Performs data read events which are triggered under two conditions:
      1. underlying `readable` events emitted when there is new data
         available on the socket
      2. the consumer requested additional data
      @private
     */
    DofusSocket.prototype._onReadable = function () {
        // Read all the data until one of two conditions is met
        // 1. there is nothing left to read on the socket
        // 2. reading is paused because the consumer is slow
        while (!this._readingPaused) {
            // First step is reading the 32-bit integer from the socket
            // and if there is not a value, we simply abort processing
            var Header = this._socket.read(2);
            if (!Header)
                return;
            var hiheader = Header.readUInt16BE();
            var packetID = hiheader >> 2;
            var lenType = hiheader & 3;
            var length = 0;
            var lenBuff = void 0;
            if (lenType >= 0 && lenType < 4) {
                if (lenType != 0)
                    lenBuff = this._socket.read(lenType);
                if (!lenBuff) {
                    // console.log("unshift header")
                    this._socket.unshift(Header);
                    return;
                }
                length = lenBuff.readIntBE(0, lenType);
            }
            // ensure that we don't exceed the max size of 256KiB
            if (length > Math.pow(2, 18)) {
                this.socket.destroy(new Error('Max length exceeded'));
                return;
            }
            // With the length, we can then consume the rest of the body.
            var body = this._socket.read(length);
            // If we did not have enough data on the wire to read the body
            // we will wait for the body to arrive and push the length
            // back into the socket's read buffer with unshift.
            if (!body) {
                //console.log("unshift body")
                this._socket.unshift(Buffer.alloc(2 + lenType));
                return;
            }
            // Try to parse the data and if it fails destroy the socket.
            var packet = {
                packetID: packetID,
                lenType: lenType,
                length: length,
                body: body
            };
            // Push the data into the read buffer and capture whether
            // we are hitting the back pressure limits
            var pushOk = void 0;
            if (packetID)
                pushOk = this.push(packet);
            // When the push fails, we need to pause the ability to read
            // messages because the consumer is getting backed up.
            if (!pushOk)
                this._readingPaused = true;
        }
    };
    /**
      Implements the readable stream method `_read`. This method will
      flagged that reading is no longer paused since this method should
      only be called by a consumer reading data.
      @private
     */
    DofusSocket.prototype._read = function () {
        this._readingPaused = false;
        setImmediate(this._onReadable.bind(this));
    };
    /**
      Implements the writeable stream method `_write` by serializing
      the object and pushing the data to the underlying socket.
     */
    DofusSocket.prototype._write = function (obj, encoding, cb) {
        var packetID = obj.packetID, lenType = obj.lenType, length = obj.length, body = obj.body;
        console.log("data to send", { packetID: packetID, lenType: lenType, length: length, body: body });
        var hbff = Buffer.alloc(2);
        var header = (packetID << 2) + lenType;
        hbff.writeInt16BE(header, 0);
        var lenbff = Buffer.alloc(lenType);
        lenbff.writeIntBE(length, 0, lenType);
        var buffer = Buffer.concat([hbff, lenbff, body]);
        console.log("buffer sent", buffer);
        this._socket.write(buffer, cb);
    };
    /**
      Implements the writeable stream method `_final` used when
      .end() is called to write the final data to the stream.
     */
    DofusSocket.prototype._final = function (cb) {
        this._socket.end(cb);
    };
    return DofusSocket;
}(Duplex));
module.exports = DofusSocket;
