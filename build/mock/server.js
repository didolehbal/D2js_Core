"use strict";
var net = require("net");
var server = net
    .createServer(function (client) {
    console.log("Client Connected...");
    client.on("data", function (data) {
        console.log(data.toString());
        client.write("WELL RECEIVED OK");
    });
})
    .on("error", function (err) {
    // Handle errors here.
    throw err;
});
server.listen({ host: "localhost", port: 5555 }, function () {
    console.log("opened server on", server.address());
});
