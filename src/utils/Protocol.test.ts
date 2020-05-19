import { deserialize, serialize, readAtomicType, writeAtomicType } from "./Protocol"
import CustomDataWrapper from "./CustomDataWraper"
import Header from "./Header"


test("serialize", () => {
  const raw = Buffer.from("598D00004DF638EF81A403", "hex")
  const header = Header.fromRaw(raw, true)
  if(header)
    header.bodyLength = header?.bodyLength -1
  //console.log(header,header?.toRaw())
  /*const rawBody = raw.slice(header?.headerLength)
  const data = deserialize(new CustomDataWrapper(rawBody), "NpcGenericActionRequestMessage")
  console.log(data)*/

})


test("deserialize", () => {

  let raw = Buffer.from("026533ef81a8df1e0006446f636b65720d01000214ec0f0005014f42160206ca1603184a1c040497100546d451000182010000020001", "hex")
  const header = Header.fromRaw(raw, true)
  if (!header)
    return

  let rawBody = raw.slice(header.headerLength)

  const dataWrapper = new CustomDataWrapper(rawBody)

  let res:any = deserialize(dataWrapper, header.name)
  console.log(res.id)

})

test("read write AtomicVar", () => {
  let vars: any[] = [
    {
      desc: { type: "Short", name: "test", length: "", optional: false },
      value: -66
    },
    {
      desc: { type: "Short", name: "test", length: "Int", optional: false },
      value: [66, -11]
    },
    {
      desc: { type: "VarInt", name: "test", length: "", optional: false },
      value: 755758
    },
    {
      desc: { type: "VarInt", name: "test", length: "UnsignedShort", optional: false },
      value: [755758, -7557544]
    },
    {
      desc: { type: "Double", name: "test", length: "", optional: false },
      value: 755758.6665
    },
    {
      desc: { type: "Double", name: "test", length: "UnsignedShort", optional: false },
      value: [755758.447, -7557544.588]
    },
    {
      desc: { type: "UTF", name: "test", length: "", optional: false },
      value: "blablablabla"
    },
    {
      desc: { type: "UTF", name: "test", length: "UnsignedShort", optional: false },
      value: ["blablablabla", "gdsdg dfgdfsg df f", "hgghhhh"]
    },
    {
      desc: { type: "Byte", name: "test", length: "", optional: false },
      value: 125
    },
    {
      desc: { type: "Byte", name: "test", length: "UnsignedShort", optional: false },
      value: [77, 111, 50]
    },
    {
      desc: { type: "VarLong", name: "test", length: "", optional: false },
      value: 12548000
    },
    {
      desc: { type: "VarLong", name: "test", length: "UnsignedShort", optional: false },
      value: [124448, 12544, 1866]
    },
  ]

  for (let i = 0; i < vars.length; i++) {
    let dataWrapper = new CustomDataWrapper()
    writeAtomicType(dataWrapper, vars[i].value, vars[i].desc)

    const res = readAtomicType(dataWrapper, vars[i].desc)
    expect(res).toEqual(vars[i].value)
  }
})
test("header", () => {
  const head = Header.fromRaw(Buffer.from("598d0000000138", "hex"), true)
})