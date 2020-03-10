const frida = require("frida");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { spawn,exec } = require("child_process");

const readFile = util.promisify(fs.readFile);

let session, script;
module.exports = {
  hook: async function hook() {
    //let process=  exec("wine /home/didilehbal/.config/Ankama/zaap/dofus/Dofus.exe")
    
    //setTimeout(async ()=> {
        const source = await readFile(path.join(__dirname, "script.js"), "utf8");
        session = await frida.attach("Dofus.exe");
        script = await session.createScript(source);
        await script.load();
    //},2000)
    // let pid =  await frida.spawn("wine /home/didilehbal/.config/Ankama/zaap/dofus/Dofus.exe")
    
  }
};
