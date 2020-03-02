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
            const rawHeader: Buffer = this._socket.read(5)
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
            if (!pushOk) this._readingPaused = true;
        }
    }
    _read() {
        this._readingPaused = false;
        setImmediate(this._onReadable.bind(this));
    }
    _write(msg: Message, encoding: string, cb: Function) {
        /*let json = JSON.stringify(obj);
        let jsonBytes = Buffer.byteLength(json);
        let buffer = Buffer.alloc(4 + jsonBytes);
        buffer.writeUInt32BE(jsonBytes);
        buffer.write(json, 4);*/
        const rawMsg = msg.pack()
        const header = new Header(msg.protocolId, 0, 0)
        header.length = rawMsg.length
        this._socket.write(Buffer.concat([header.toRaw(), rawMsg]));
    }
    _final() {
        this._socket.end();
    }

}