const net = require("net");
const Selected = require( "../ankama/SelectedServerDataMessage")
const Header = require( "../network/Header")



module.exports = function start(){
  const server = net
  .createServer(client => {
    console.log("Client Connected...");
    setInterval(()=>{
      let slm = new Selected()
      const head = new Header(Selected.protocolId,0,0)
      const raw = slm.pack()
      head.length = raw.length
      client.write(Buffer.concat([head.toRaw(), raw]))
    },1000)
  })
  .on("error", err => {
    // Handle errors here.
    throw err;
  });

  server.listen({ host: "localhost", port: 5555 }, () => {
    console.log("opened server on", server.address());
  });
}