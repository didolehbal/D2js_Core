"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var net_1 = __importStar(require("net"));
var config_json_1 = __importDefault(require("./config.json"));
var axios_1 = __importDefault(require("axios"));
var SocketHandler_1 = __importDefault(require("./network/SocketHandler"));
axios_1.default.put("http://127.0.0.1:80/api/createandinject?exePath=" + config_json_1.default.DOFUS_PATH, {
    RedirectionPort: config_json_1.default.port,
    RedirectedIps: config_json_1.default.authServerIps
})
    .then(function (res) {
    console.log("Injection success", res.data);
})
    .catch(function (err) {
    console.error("Injection failed", err.response);
});
var proxy = net_1.default.createServer();
function handleConnection(dofusClient) {
    console.log("dofus client connected");
    var dofusServer = new net_1.Socket();
    try {
        dofusServer.connect({ port: 5555, host: config_json_1.default.authServerIps[0] });
    }
    catch (ex) {
        console.trace(ex);
        process.exit(-1);
    }
    var clientHandler = new SocketHandler_1.default(dofusClient, dofusServer, "CLIENT");
    var serverHandler = new SocketHandler_1.default(dofusServer, dofusClient, "SERVER");
}
proxy.on("connection", handleConnection);
proxy.on("error", function (err) {
    console.log(err);
});
proxy.on("listening", function () {
    console.log("Proxy listening...");
});
proxy.on("close", function () {
    console.log("client disconnected...");
});
proxy.listen({ host: "localhost", port: config_json_1.default.port });
