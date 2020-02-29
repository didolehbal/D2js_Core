import Config from "./config.json"
import axios from "axios"
import AuthProxy from "./AuthProxy"

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

