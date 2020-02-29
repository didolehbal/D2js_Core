import Net, { Socket } from "net"
import Config from "./config.json"
import axios from "axios"
import Proxy from "./Proxy"

axios.put(`http://127.0.0.1:80/api/createandinject?exePath=${Config.DOFUS_PATH}`, {
    RedirectionPort: Config.port,
    RedirectedIps: Config.authServerIps
})
    .then(res => {
        console.log("Injection success", res.data)
    })
    .catch(err => {
        console.error("Injection failed", err.response)
    })

const authProxy = new Proxy(Config.authServerIps[0], Config.port)
authProxy.start()

const gameProxy = new Proxy("thanatena.ankama-games.com",7777)
gameProxy.start()