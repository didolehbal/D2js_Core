import { Socket } from 'net'
import { Duplex } from 'stream'
import Header from './Header';
import Message from '../ankama/Message';

export default class DofusSocket extends Duplex {
    private _readingPaused: boolean;
    private _socket: Socket;
    constructor(socket: Socket) {
        super({ objectMode: true });
        this._readingPaused = false;
        this._socket = socket;
        this._initSocket()
    }
    private _initSocket() {
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
    _onReadable() {
        while (!this._readingPaused) {

            const rawHiHeader: Buffer = this._socket.read(2)
            if (!rawHiHeader)
                return;

            const hiHeader = rawHiHeader.readUInt16BE(0)
            const packetID = hiHeader >> 2
            const lenType = hiHeader & 3

            if (lenType > 3 || lenType < 0) {
                throw new Error("Invalide LenType value : " + lenType)
            }

            let rawLength: Buffer = Buffer.alloc(0)
            let length = 0
            if (lenType > 0) {
                rawLength = this._socket.read(lenType)
                if (!rawLength) {
                    this._socket.unshift(rawHiHeader)
                    return
                }
                length = rawLength.readUIntBE(0, lenType)
            }

            const header = new Header(packetID, lenType, length)

            if (packetID === 6253) {
                this.push({header:null,rawMsg:Buffer.concat([rawHiHeader,rawLength])})
                do {

                    const rawHiHeader: Buffer = this._socket.read(2)
                    if (!rawHiHeader)
                        return;

                    const hiHeader = rawHiHeader.readUInt16BE(0)
                    const packetID = hiHeader >> 2

                    if(packetID === 6100){
                        console.log("PACKET FOUND "+packetID)
                        this._socket.unshift(rawHiHeader);
                        return
                    }
                    this.push({header:null,rawMsg:rawHiHeader})
                } while (true);
            }

            let rawMsg: Buffer = Buffer.alloc(0)
            if (header.length > 0) {
                rawMsg = this._socket.read(header.length)
                if (!rawMsg) {
                    console.log("unshift " + header.length)
                    this._socket.unshift(Buffer.concat([rawHiHeader, rawLength]))
                    return
                }
            }

            const packet = {
                header,
                rawMsg
            }
            let pushOk = this.push(packet);

            // pause reading if consumer is slow
            if (!pushOk) this._readingPaused = true;
        }
    }
    _read() {
        this._readingPaused = false;
        setImmediate(this._onReadable.bind(this));
    }
    _write(data: Buffer, encoding: string, cb: Function) {
        this._socket.write(data);
    }
    _final() {
        this._socket.end();
    }

}