import DofusSocket from "./DofusSocket"
import start  from "../mock/server"
import { Socket } from "net"

test("does decoup work", () => {
    const header = { length: 300 }
    let readed = 0
    for (let i = 0; i < Math.floor(header.length / 1024); i++) {
        let toread = 1024
        console.log(toread)
        readed += toread
    }
    readed += header.length % 1024

    expect(readed).toEqual(header.length)
})


test("on Readable", () => {
    start()
    const socket = new Socket()
    socket.connect({ port: 5555, host: "localhost" })
    let dofusSocket = new DofusSocket(socket)
    dofusSocket.on("data",({header,rawMsg})=>{
        console.log(header)
    })
})