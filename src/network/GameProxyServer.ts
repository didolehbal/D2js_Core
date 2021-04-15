import ProxyServer from "./ProxyServer";
import { Socket } from "net";
import Proxy from "./Proxy";
import { store } from "../redux/store";
import { ObservableArray } from "../utils/ObservableArray";
import { SocksClient, SocksClientOptions } from "socks";
import { CustomSocksProxy } from "./CustomSocksProxy";

export default class GameProxyServer extends ProxyServer {
  private gameProxies: ObservableArray<Proxy>;
  constructor(
    remoteAdress: string,
    localPort: number,
    gameProxies: ObservableArray<Proxy>,
    private socksProxy: CustomSocksProxy
  ) {
    super(remoteAdress, localPort);
    this.gameProxies = gameProxies;
  }

  protected handleConnection = async (dofusClient: Socket) => {
    console.log("dofus client connected");

    let dofusServer: any = null;
    const { proxyToUse } = this.socksProxy;
    try {
      if (proxyToUse) {
        const options: SocksClientOptions = {
          proxy: proxyToUse,
          command: "connect", // SOCKS command (createConnection factory function only supports the connect command)
          destination: {
            host: this._remoteAddress,
            port: this._remotePort,
          },
        };
        try {
          const info = await SocksClient.createConnection(options);
          dofusServer = info.socket;
          console.log(`connection en utilisant le proxy ${proxyToUse.host}`);
        } catch (ex) {
          console.trace(ex);
          throw "Proxy Not Working";
        }
      } else {
        try {
          console.log(`connection sans proxy`);
          dofusServer = new Socket();
          dofusServer.connect({
            port: this._remotePort,
            host: this._remoteAddress,
          });
        } catch (ex) {
          console.trace(ex);
          throw "error connecting";
        }
      }

      console.log({ port: this._remotePort, host: this._remoteAddress });
      dofusServer.on("connect", () => {
        console.log("connected to dofus Game server !");
      });

      const proxy = new Proxy(dofusClient, dofusServer, []);
      proxy.start();

      this.gameProxies.push(proxy);

      dofusClient.on("close", (had_error) => {
        this.gameProxies.remove(proxy);
        store.dispatch({
          type: "REMOVE_CLIENT",
          payload: { client_id: proxy.id },
        });
        console.log("Client Disconnected", { error: had_error });
        dofusServer.end();
      });
    } catch (ex) {
      console.trace(ex);
    }
  };
}
