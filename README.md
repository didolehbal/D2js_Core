# Dofus 2 MITM Core #

this is the core library for D2js MITM

### Quick Doc :

###### startAuthServer
```
import {startAuthServer} from "./D2js_Core"
```
startAuthServer which starts an Authserver from the authServerIps array in the config.json

it should be called once on app boot up

###### gameProxies

```
import {gameProxies} from "./D2js_Core"
```

Observable gameProxies array that represents  one dofus client connection to dofus game server

```
Methods : 
    push(el: Proxy)
    remove(el: Proxy)
    on(evt: 'push' | 'remove', cb: Function)
properties :
    items : ProxyT[]
```

###### actionsApi

```
import {actionsApi} from "./D2js_Core"
```

these are dofus actions to be injected through gameProxy

example :

```
 const msg = actionsApi.talkToNPC(data.npcId, data.npcActionId, data.npcMapId)
 proxy.sendToServer(msg)
``` 


