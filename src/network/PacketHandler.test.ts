import PROTOCOL from "./protocol.json"

const msg_from_id = PROTOCOL.msg_from_id as Anything
interface Anything {
    [key: string]: any;
  }

test("does work",()=>{
    const name ="6469"
    const packetName = msg_from_id[name].name
    expect(packetName).toEqual("SelectedServerDataExtendedMessage")
})