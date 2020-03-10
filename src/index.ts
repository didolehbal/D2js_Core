import Config from "./network/config.json"
import axios from "axios"
import AuthProxy from "./network/AuthProxy"
import GameProxy from "./network/GameProxy.js"

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

const authProxy = new AuthProxy()
authProxy.start()

const gameProxy = new GameProxy("thanatena.ankama-games.com", 7778)
gameProxy.start()