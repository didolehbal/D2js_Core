var connect_p = Module.getExportByName(null, "connect");
var send_p = Module.getExportByName(null, "send");
// ssize_t send(int sockfd, const void * buf, size_t len, int flags);
var socket_send = new NativeFunction(send_p, "int", [
  "int",
  "pointer",
  "int",
  "int"
]);
var recv_p = Module.getExportByName(null, "recv");
// ssize_t recv(int sockfd, void *buf, size_t len, int flags);
var socket_recv = new NativeFunction(recv_p, "int", [
  "int",
  "pointer",
  "int",
  "int"
]);

Interceptor.attach(connect_p, {
  onEnter: function(args) {
    // int connect(int sockfd, const struct sockaddr *addr,
    //             socklen_t addrlen);
    console.log("test")
    const blackList = ["34.252.21.81", "63.34.214.78", "52.17.231.202"];
    this.sockfd = args[0];
    var sockaddr_p = args[1];
    let port = 256 * sockaddr_p.add(2).readU8() + sockaddr_p.add(3).readU8();
    let addr = "";
    for (var i = 0; i < 4; i++) {
      addr += sockaddr_p.add(4 + i).readU8(4);
      if (i < 3) addr += ".";
    }

    if (blackList[0] == addr || blackList[1] == addr || blackList[2] == addr) { // .includes is undefined idk why 
      var newport = 5555;
      sockaddr_p
        .add(2)
        .writeByteArray([Math.floor(newport / 256), newport % 256]);
      sockaddr_p.add(4).writeByteArray([127, 0, 0, 1]);

      console.log(`redirected from: ${addr}:${port} To localhost:${newport}}`);
    }else{

        //console.log(`/!\ not redirected from ${addr}:${port}`)
    }
  }
  /*onLeave: function (retval) {
        console.log("retval:", retval.toInt32());
        var connect_request = "CONNECT " + addr + ":" + port + " HTTP/1.0\n\n";
        var buf_send = Memory.allocUtf8String(connect_request);
        socket_send(this.sockfd.toInt32(), buf_send, connect_request.length, 0);
        var buf_recv = Memory.alloc(512);
        var recv_return = socket_recv(this.sockfd.toInt32(), buf_recv, 512, 0);
        while (recv_return == -1) {
            Thread.sleep(0.05);
            recv_return = socket_recv(this.sockfd.toInt32(), buf_recv, 512, 0);
        }
        console.log(buf_recv.readCString().split('\n')[0], '\n');
    }*/
});
