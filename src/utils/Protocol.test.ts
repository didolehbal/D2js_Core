import { deserialize, serialize, readAtomicType, writeAtomicType } from "./Protocol"
import CustomDataWrapper from "./CustomDataWraper"
import Header from "./Header"


test("deserialize", () => {
  let raw = Buffer.from("65160168ef01001a7468616e6174656e612e616e6b616d612d67616d65732e636f6d0002000015b3000001bb0020afc276b4fe7ef8687068d4cc94364d90b9cde9a5a649958051fa2b1556690791001202320403000005000000000000000000d2010003000003000000000000000000cb010003000003000000000000000000ce010003000003000000000000000000d1010003000003000000000000000000d4010003000003000000000000000000240003000003000000000000000002ef01010300040542770b57f617700002c90100030001044277078bfe71000000cc010003000003000000000000000000cf010003000003000000000000000002160103000001000000000000000003de01000300010442770b08543ec00000630303000005000000000000000000ca010003000003000000000000000000cd010003000003000000000000000000d0010003000003000000000000000000d30100030000030000000000000000", "hex")

  //let raw = Buffer.from("580151002441e013e01de00000003c01bf04e1010000000000018201000000054178696f6d009d00080000000101999c030006477261696e6501ab01000994060800098f1d07c1ae5100000041e013e024a00000", "hex")
  //let raw = Buffer.from("64d90a0001ef81b0a60d000115", "hex")
  const header = Header.fromRaw(raw)
//3570139375
  let rawBody = raw.slice(header.lenType + 2)
  //expect(rawBody.length).toBeGreaterThanOrEqual(header.length)

  const dataWrapper = new CustomDataWrapper(rawBody)

  let res = deserialize(dataWrapper, header.packetID)
  console.log(header.toString())
  console.log(res)
  
  let rawRes = serialize(new CustomDataWrapper(), res, header.packetID)

  expect(rawRes.length).toEqual(rawBody.length)
  expect(rawBody).toEqual(rawRes)

})

test("read write AtomicVar", () => {
  let vars: any[] = [
    {
      desc: { type: "Short", name: "test", length: "", optional: false },
      value: -66
    },
    {
      desc: { type: "Short", name: "test", length: "Int", optional: false },
      value: [66,-11]
    },
    {
      desc: { type: "VarInt", name: "test", length: "", optional: false },
      value: 755758
    },
    {
      desc: { type: "VarInt", name: "test", length: "UnsignedShort", optional: false },
      value: [755758,-7557544]
    },
    {
      desc: { type: "Double", name: "test", length: "", optional: false },
      value: 755758.6665
    },
    {
      desc: { type: "Double", name: "test", length: "UnsignedShort", optional: false },
      value: [755758.447,-7557544.588]
    },
    {
      desc: { type: "UTF", name: "test", length: "", optional: false },
      value: "blablablabla"
    },
    {
      desc: { type: "UTF", name: "test", length: "UnsignedShort", optional: false },
      value: ["blablablabla","gdsdg dfgdfsg df f","hgghhhh"]
    },
    {
      desc: { type: "Byte", name: "test", length: "", optional: false },
      value: 125
    },
    {
      desc: { type: "Byte", name: "test", length: "UnsignedShort", optional: false },
      value: [77,111,50]
    },
    {
      desc: { type: "VarLong", name: "test", length: "", optional: false },
      value: 12548
    },
    {
      desc: { type: "VarLong", name: "test", length: "UnsignedShort", optional: false },
      value: [124448,12544,1866]
    },
  ]

  for (let i = 0; i < vars.length; i++) {
    let dataWrapper = new CustomDataWrapper()
    writeAtomicType(dataWrapper,vars[i].desc,vars[i].value)

    const res = readAtomicType(dataWrapper, vars[i].desc)
    expect(res).toEqual(vars[i].value)
  }
})