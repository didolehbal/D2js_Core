import {getMsgFromId} from "./utils/Protocol"
import PacketHandler from "./PacketHandler"
import {MsgAction} from "./types"
import { deserialize} from "./utils/Protocol"
import Header from "./utils/Header"
import CustomDataWrapper from "./utils/CustomDataWraper"
/*test("does work",()=>{
    const name =6100
    const packetName = msg_from_id[name].name
    console.log(packetName)
    expect(packetName).toEqual("QueueStatusMessage")
    
})
*/

test("processchunk works", () => {
  const msgAction1 : MsgAction = {
    protocolId:6469,
    typeName:"SelectedServerDataMessage",
    alter:function(data:any) {
        data.address = "localhost";
        data.ports =[5555]
    },
    doInBackground:function(data:any){
        console.log(`redirected from ${data?.address} ${data?.ports} to localhost [5555]`)
    }
}
const msgAction2 : MsgAction = {
    protocolId:42,
    typeName:"SelectedServerDataExtendedMessage",
    alter:function(data:any) {
        data.address = "localhost";
        data.ports =[5555]
    },
    doInBackground:null
}
  const packetHandler = new PacketHandler([msgAction1,msgAction2],"TEST");
  const data = Buffer.from("65160168ef01001a7468616e6174656e612e616e6b616d612d67616d65732e636f6d0002000015b3000001bb0020afc276b4fe7ef8687068d4cc94364d90b9cde9a5a649958051fa2b1556690791001202320403000005000000000000000000d2010003000003000000000000000000cb010003000003000000000000000000ce010003000003000000000000000000d1010003000003000000000000000000d4010003000003000000000000000000240003000003000000000000000002ef01010300040542770b57f617700002c90100030001044277078bfe71000000cc010003000003000000000000000000cf010003000003000000000000000002160103000001000000000000000003de01000300010442770b08543ec00000630303000005000000000000000000ca010003000003000000000000000000cd010003000003000000000000000000d0010003000003000000000000000000d30100030000030000000000000000","hex")
  let processedData = packetHandler.processChunk(data)
  const pHeader = Header.fromRaw(processedData)
  const pContent:any = deserialize(new CustomDataWrapper( processedData.slice(pHeader.lenType + 2)), pHeader.name)
  expect(pContent.address).toEqual("localhost")
  expect(pContent.ports).toEqual([5555])
})