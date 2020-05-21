const frida = require("frida");
const fs = require("fs");
const path = require("path");
const util = require("util");
const { spawn, execFile,exec } = require("child_process");
const config = require("../config.json")
const readFile = util.promisify(fs.readFile);
const os = require("os")

let session, script;
module.exports = {
  hook: function hook() {
    let isWin = false
    if(os.platform() == "win32"){
      isWin=true
      console.log("windows")
    }
const runProgram = isWin?execFile : exec

    let process = runProgram(
      isWin? config.DOFUS_PATH : "wine "+ config.DOFUS_PATH //"wine /home/didilehbal/.config/Ankama/zaap/dofus/Dofus.exe"
    );
    //let pid =  await frida.spawn("/home/didilehbal/.config/Ankama/zaap/dofus/Dofus.exe")
   (async () => {
      const source = await readFile(path.join(__dirname, "script.js"), "utf8");
      console.log("THIS PID "+process.pid)
      session = await frida.attach(isWin?process.pid:process.pid + 1); // +1 cuz dofus pid comes after sh pid
      script = await session.createScript(source);
      await script.load();
    })()
    return isWin?process.pid:process.pid + 1;
  }
};
