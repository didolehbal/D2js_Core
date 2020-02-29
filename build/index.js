"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_json_1 = __importDefault(require("./config.json"));
var axios_1 = __importDefault(require("axios"));
var AuthProxy_1 = __importDefault(require("./AuthProxy"));
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
var authProxy = new AuthProxy_1.default();
authProxy.start();
