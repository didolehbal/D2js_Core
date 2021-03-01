import { Socket } from "net";
import MessagingHandler from "./MessagingHandler";
import { MsgAction } from "../redux/types"
import { store } from "../redux/store"
import { Action, State } from "../redux/types"
import { actionsFactory } from "../redux/actions"
import { Store } from "redux"

let instance_id = 0
export default class Proxy {
    private client: Socket;
    private server: Socket;
    public readonly id: number
    private serverMessagingHandler: MessagingHandler;
    private clientMessagingHandler: MessagingHandler;
    private _store: Store<State, Action>;

    constructor(client: Socket, server: Socket, serverMsgsActions: MsgAction[]) {
        this.client = client;
        this.server = server;
        this.serverMessagingHandler = new MessagingHandler(serverMsgsActions, false, this.sendToServer, this.sendToClient)
        this.clientMessagingHandler = new MessagingHandler([], true, this.sendToServer, this.sendToClient)
        this.id = ++instance_id
        this._store = store;
        this.init_actions()
    }
    get store() {
        return this._store
    }
    getState() {
        const state = this._store.getState()
        return {
            character: state.character[this.id],
            map: state.map[this.id],
        }
    }
    public init_actions() {
        let actions = actionsFactory(this.id, this.store)
        actions.serverActions.map(action => this.serverMessagingHandler.msgsActions.push(action))
        actions.clientActions.map(action => this.clientMessagingHandler.msgsActions.push(action))
    }

    public sendToClient = (data: Buffer) => {
        let flushed = this.client.write(data);
        /* if (!flushed) {
             console.log("/!\ client not flushed; pausing local");
             this.server.pause();
         }*/
    }

    public sendToServer = (data: Buffer) => {
        let flushed = this.server.write(data);
        /*if (!flushed) {
            console.log("/!\ server not flushed; pausing local");
            this.client.pause();
        }*/
    }

    public disconnect = () => {
        this.server.end(() => console.log("disconnecting from server..."))
        this.client.end(() => console.log("disconnecting from client..."))
    }
    public actionToServer(action: MsgAction) {
        this.serverMessagingHandler.msgsActions.push(action)
    }
    public start = () => {
        const { server, client } = this;
        client.on("data", (data) => {
            try {
                const processedData: Buffer = this.clientMessagingHandler.processChunk(data)
                this.sendToServer(processedData)
            } catch (ex) {
                console.trace(ex)
                this.sendToServer(data)
                this.clientMessagingHandler.reset()
            }
        })
        server.on("data", (data) => {
            try {
                const processedData: Buffer = this.serverMessagingHandler.processChunk(data)
                this.sendToClient(processedData)
            } catch (ex) {
                console.trace(ex)
                this.sendToClient(data)
                this.serverMessagingHandler.reset()
            }
        })


        client.on('drain', function () {
            server.resume();
        });

     
        server.on('drain', function () {
            client.resume();
        });

        client.on('error', function (err) {
            console.log(err)
        });

        server.on('error', function (err) {
            console.log(err)
        });
        server.on('close', function (had_error: any) {
            console.log("Server Disconnected", { error: had_error })
            client.end();
        });
    }
}