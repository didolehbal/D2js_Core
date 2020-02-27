import Net, { Socket } from "net"
import Config from "./config.json"
import SocketHandler from "./network/SocketHandler"
import PacketHandler from "./network/PacketHandler.js"

const proxy = Net.createServer()

function handleConnection(dofusClient: Socket) { 

    console.log("dofus client connected")

    const dofusServer: Socket = new Socket()

    try {
        dofusServer.connect({ port: 5555, host: Config.authServerIps[0] });
    }
    catch (ex) {
        console.trace(ex)
        process.exit(-1)
    }

    const clientHandler = new SocketHandler(dofusClient,dofusServer, new PacketHandler(()=>{}));

    const serverHandler = new SocketHandler(dofusServer,dofusClient, new PacketHandler(()=>{}));

    
}

proxy.on("connection", handleConnection);

proxy.listen(Config.port)