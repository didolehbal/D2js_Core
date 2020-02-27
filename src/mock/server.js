const net = require("net");

const server = net
  .createServer(client => {
    console.log("Client Connected...");
    client.on("data", function(data) {
      console.log(data.toString());
      client.write("WELL RECEIVED OK");
    });
  })
  .on("error", err => {
    // Handle errors here.
    throw err;
  });

server.listen({ host: "localhost", port: 5555 }, () => {
  console.log("opened server on", server.address());
});
