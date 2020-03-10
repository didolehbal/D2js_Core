import frida from "frida"
import util from "util"
import fs from "fs"
import path from "path"

const readFile = util.promisify(fs.readFile);

let session, script;

export async function hook() {
    console.log(frida)
    if(!frida)
        return
    //frida.spawn()
    const source = await readFile(path.join(__dirname, 'script.js'), 'utf8');
    session = await frida.attach('Dofus');
    script = await session.createScript(source);
    //script.message.connect(onMessage);
    await script.load();
    console.log("Hooked !")
}

function onError(error:any) {
    console.error(error.stack);
}
function onMessage(message :any, data:any) {
    if (message.type === 'send') {
        console.log(message.payload);
    } else if (message.type === 'error') {
        console.error(message.stack);
    }
}
