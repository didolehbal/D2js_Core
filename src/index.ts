import AuthProxyServer from "./network/AuthProxyServer";
import { MsgAction } from "./redux/types";
import Proxy from "./network/Proxy";
import { ObservableArrayFactory } from "./utils/ObservableArray";
import { CustomSocksProxy } from "./network/CustomSocksProxy";

export const gameProxies = ObservableArrayFactory<Proxy>();
export const SocksProxies: CustomSocksProxy = { proxyToUse: null /*{
    host: "195.133.80.213", // ipv4 or ipv6 or hostname
    port: 2928,
    type: 5,
    userId: "mehdi",
    password: "MeHd44ii63",
  }*/ };

export function startAuthServer() {
  const authProxy = new AuthProxyServer(gameProxies, SocksProxies);
  authProxy.start();
}

//startAuthServer();

export * as actionsApi from "./api/";
export type ProxyType = Proxy;
export type Action = MsgAction;
