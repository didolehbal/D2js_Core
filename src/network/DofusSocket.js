const { Socket } = require('net');
const { Duplex } = require('stream');

class DofusSocket extends Duplex {
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
  constructor(socket) {
    super({ objectMode: true });

    /**
      True when read buffer is full and calls to `push` return false.
      Additionally data will not be read off the socket until the user
      calls `read`.
      @private
      @type {boolean}
     */
    this._readingPaused = false;

    /**
      The underlying TCP Socket
      @private
      @type {Socket}
     */
    this._socket;

    // wrap the socket
    if (socket) this._wrapSocket(socket);
  }

  /**
    Connect to a DofusSocket server.
    @param {object} param
    @param {string} [param.host] the host to connect to. Default is localhost
    @param {number} param.port the port to connect to. Required.
    @return {DofusSocket}
   */
  connect({ host, port }) {
    this._wrapSocket(new Socket());
    this._socket.connect({ host, port });
    return this;
  }

  /**
    Wraps a standard TCP Socket by binding to all events and either
    rebroadcasting those events or performing custom functionality.
    @private
    @param {Socket} socket
   */
  _wrapSocket(socket) {
    this._socket = socket;
    this._socket.on('close', hadError => this.emit('close', hadError));
    this._socket.on('connect', () => this.emit('connect'));
    this._socket.on('drain', () => this.emit('drain'));
    this._socket.on('end', () => this.emit('end'));
    this._socket.on('error', err => this.emit('error', err));
    this._socket.on('lookup', (err, address, family, host) => this.emit('lookup', err, address, family, host)); // prettier-ignore
    this._socket.on('ready', () => this.emit('ready'));
    this._socket.on('timeout', () => this.emit('timeout'));
    this._socket.on('readable', this._onReadable.bind(this));
  }

  /**
    Performs data read events which are triggered under two conditions:
    1. underlying `readable` events emitted when there is new data
       available on the socket
    2. the consumer requested additional data
    @private
   */
  _onReadable() {
    // Read all the data until one of two conditions is met
    // 1. there is nothing left to read on the socket
    // 2. reading is paused because the consumer is slow
    while (!this._readingPaused) {
      // First step is reading the 32-bit integer from the socket
      // and if there is not a value, we simply abort processing
      
      let Header = this._socket.read(2)

      if (!Header) return;
      let hiheader = Header.readUInt16BE()

      let packetID = hiheader >> 2
      let lenType = hiheader & 3
      let length = 0
      let lenBuff

  
      if(lenType >= 0 && lenType < 4){
        if(lenType != 0)
            lenBuff = this._socket.read(lenType)
        if(!lenBuff){
           // console.log("unshift header")
            this._socket.unshift(Header);
            return;
        }
        length = lenBuff.readIntBE(0,lenType);
      }

      

      // ensure that we don't exceed the max size of 256KiB
      if (length > 2 ** 18) {
        this.socket.destroy(new Error('Max length exceeded'));
        return;
      }

      // With the length, we can then consume the rest of the body.
      let body = this._socket.read(length);

      // If we did not have enough data on the wire to read the body
      // we will wait for the body to arrive and push the length
      // back into the socket's read buffer with unshift.
      if (!body) {
          //console.log("unshift body")
        this._socket.unshift(Buffer.alloc(2 + lenType));
        return;
      }
 
      // Try to parse the data and if it fails destroy the socket.
           let packet ={
            packetID,
            lenType,
            length,
            body
        }
      // Push the data into the read buffer and capture whether
      // we are hitting the back pressure limits
      let pushOk
      if(packetID)
         pushOk  = this.push(packet);
     
      // When the push fails, we need to pause the ability to read
      // messages because the consumer is getting backed up.
      if (!pushOk) this._readingPaused = true;
    }
  }

  /**
    Implements the readable stream method `_read`. This method will
    flagged that reading is no longer paused since this method should
    only be called by a consumer reading data.
    @private
   */
  _read() {
    this._readingPaused = false;
    setImmediate(this._onReadable.bind(this));
  }

  /**
    Implements the writeable stream method `_write` by serializing
    the object and pushing the data to the underlying socket.
   */
  _write(obj, encoding, cb) {
    const {packetID,lenType, length, body} = obj
    console.log("data to send",{packetID,lenType, length, body})
    let hbff = Buffer.alloc(2);
    let header = (packetID << 2) + lenType
    hbff.writeInt16BE(header,0)

    let lenbff = Buffer.alloc(lenType);
    lenbff.writeIntBE(length, 0, lenType)
    
    let buffer = Buffer.concat([hbff,lenbff,body])

    console.log("buffer sent",buffer)
    this._socket.write(buffer, cb);
  }

  /**
    Implements the writeable stream method `_final` used when
    .end() is called to write the final data to the stream.
   */
  _final(cb) {
    this._socket.end(cb);
  }
}

module.exports = DofusSocket;