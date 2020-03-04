import PROTOCOL from "./protocol.json"

const msg_from_id = PROTOCOL.msg_from_id as Anything
interface Anything {
    [key: string]: any;
  }

test("does work",()=>{
    const name =6100
    const packetName = msg_from_id[name].name
    console.log(packetName)
    expect(packetName).toEqual("QueueStatusMessage")
    
})