import PROTOCOL from "./protocol.json"
import PacketHandler from "./PacketHandler"

const msg_from_id = PROTOCOL.msg_from_id as Anything
interface Anything {
  [key: string]: any;
}

/*test("does work",()=>{
    const name =6100
    const packetName = msg_from_id[name].name
    console.log(packetName)
    expect(packetName).toEqual("QueueStatusMessage")
    
})
*/

test("processchunk works", () => {
  const packetHandler = new PacketHandler();
  const data = Buffer.from("000508000007a7000007a701","hex")
  const data2 = Buffer.from("945f5104000100015f510400000000","hex")
  let headers = packetHandler.processChunk(data)
  expect(headers.length).toEqual(1)
  console.log(headers)
   headers = packetHandler.processChunk(data2)
  expect(headers.length).toEqual(3)
  console.log(headers)
})