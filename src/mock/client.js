const net = require("net");
const client = net.createConnection({ port: 7778 }, () => {
  // 'connect' listener.
  console.log("connected to server!");
  setInterval(() => {
    client.write("hi, im Client !");
  }, 1000);
});
client.on("data", data => {
  console.log(data.toString());
});
client.on("end", () => {
  console.log("disconnected from server");
});
