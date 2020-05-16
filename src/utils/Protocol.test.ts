import { deserialize, serialize, readAtomicType, writeAtomicType } from "./Protocol"
import CustomDataWrapper from "./CustomDataWraper"
import Header from "./Header"


test("serialize",()=>{
  const hash =Buffer.from("4577A3A94792C7B2 82 17 A7 8C EC AA AD A6 D5 8B 3C B2 44 06 97 6D 0D 6D C6 10 CD 4D 13 8F 59 07 C0 7A 2D 2C E2 01 96 B7 B8 D4 E2 72 6B BB","hex")
  const data = {
    targetId:45456,
    targetCellId:54,
    friendly:false
  }


  const raw = serialize(new CustomDataWrapper(),data,"GameRolePlayPlayerFightRequestMessage")
  let header = new Header(5731,raw.length,Header.GLOBAL_INSTANCE_ID+1)

})


test("deserialize", () => {
  
  let raw = Buffer.from("56BD00004B7A05EF8184D10E", "hex")
  const header = Header.fromRaw(raw,true)

  if(!header)
    return

  let rawBody = raw.slice(header.headerLength)

  const dataWrapper = new CustomDataWrapper(rawBody)

  let res = deserialize(dataWrapper, header.name)
  console.log(header.toString())
  console.log(rawBody)

  console.log(res)
  
  let rawRes = serialize(new CustomDataWrapper(), res, header.name)

  expect(raw.length).toEqual(rawBody.length + header.headerLength)
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
      value: 12548000
    },
    {
      desc: { type: "VarLong", name: "test", length: "UnsignedShort", optional: false },
      value: [124448,12544,1866]
    },
  ]

  for (let i = 0; i < vars.length; i++) {
    let dataWrapper = new CustomDataWrapper()
    writeAtomicType(dataWrapper,vars[i].value, vars[i].desc)

    const res = readAtomicType(dataWrapper, vars[i].desc)
    expect(res).toEqual(vars[i].value)
  }
})
test("header",()=>{
  const head = Header.fromRaw(Buffer.from("598d0000000138","hex"),true)
  console.log(head)
})