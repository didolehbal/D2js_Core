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
            const header = Header.HeaderFromStream(this._socket)
            if(!header)
                return
            
            let rawMsg: Buffer = Buffer.alloc(0)
            
            if (header.length > 0) {
                const count = Math.floor(header.length / 1024)
                for (let i = 0; i < count; i++) {

                    rawMsg = this._socket.read(1024)
                    if (!rawMsg) {
                        i--
                        continue
                    }
                    if (i == 0) {
                        this.push({ header, rawMsg })
                    }
                    else
                        this.push({ restOfMsg: rawMsg })
                }
                if(header.length % 1024 > 0){
                    do {
                        rawMsg = this._socket.read(header.length % 1024)
                    } while (!rawMsg);
                    this.push({ restOfMsg: rawMsg })
                }
            }

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