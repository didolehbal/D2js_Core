"use strict";
var net = require("net");
var client = net.createConnection({ port: 8888 }, function () {
    // 'connect' listener.
    console.log("connected to server!");
    setInterval(function () {
        client.write("hi, im Client !");
    }, 1000);
});
client.on("data", function (data) {
    console.log(data.toString());
});
client.on("end", function () {
    console.log("disconnected from server");
});
