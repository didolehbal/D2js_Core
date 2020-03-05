import { Socket } from 'net'
import { Duplex } from 'stream'
import Header from './Header';
import Message from '../ankama/Message';

export default class DofusSocket extends Duplex {
    private _readingPaused: boolean;
    private _socket: Socket;

    private currentMsgHeader: Header | null = null
    private currentMsgIndex: number = 0
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
        let { currentMsgHeader: header } = this
        while (!this._readingPaused) {
            // reading header if available 
            if (!header) {
                header = Header.HeaderFromStream(this._socket)
                if (!header)
                    return
            }

            let rawMsg: Buffer = Buffer.alloc(0)

            if (header.length > 0) {

                const count = Math.floor(header.length / 1024)
                for (let i = this.currentMsgIndex; i < count; i++) { // starting from the last index 

                    this.currentMsgIndex = i; // we set new index

                    rawMsg = this._socket.read(1024)
                    if (!rawMsg) {
                        return;
                    }
                    if (!this.currentMsgHeader) {
                        this.currentMsgHeader = header; // set the header we are currently working on and push it to dest
                        this.push({ header, rawMsg })
                    }
                    else
                        this.push({ restOfMsg: rawMsg })
                }
                let rest = header.length % 1024
                if (rest > 0) {
                    rawMsg = this._socket.read(rest)
                    if (!rawMsg)
                        return
                    this.currentMsgHeader = null;
                    this.currentMsgIndex = 0;
                    this.push({ restOfMsg: rawMsg })
                }
            }
            else {
                this.push({ header, rawMsg })
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