const {Socket} = require("net")

let sock = new Socket()
sock.connect({host:"63.34.214.78",port:5555},)

sock.on("connect",()=>console.log("connected"))

sock.on("error",err => console.log(err))