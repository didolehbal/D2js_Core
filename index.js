const {Socket} = require("net")

let sock = new Socket()
sock.connect({host:"thanatena.ankama-games",port:5555},)

sock.on("connect",()=>console.log("connected"))