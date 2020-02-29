import Net, { Socket } from "net"
import Config from "./config.json"
import axios from "axios"
import DofusSocket from "./network/DofusSocket"
import SocketHandler from "./network/SocketHandler"

axios.put(`http://127.0.0.1:80/api/createandinject?exePath=${Config.DOFUS_PATH}`,{
    RedirectionPort:Config.port,
    RedirectedIps:Config.authServerIps
})
.then(res=>{
    console.log("Injection success",res.data)
})
.catch(err => {
    console.error("Injection failed",err.response)
})

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

    const clientHandler = new SocketHandler(dofusClient,dofusServer,"CLIENT");

    const serverHandler = new SocketHandler(dofusServer,dofusClient,"SERVER");

    
}

proxy.on("connection", handleConnection);
proxy.on("error", (err)=> {
    console.log(err)
})
proxy.on("listening",()=>{
    console.log("Proxy listening...")
})
proxy.on("close",()=>{
    console.log("client disconnected...")
})
proxy.listen({ host: "localhost", port: Config.port })