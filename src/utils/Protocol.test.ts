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

  let raw = Buffer.from("0ed900000087400003721b620d61f141a2580e08000000bda5769fb06be40246fb262bd34a1a2f9347839ec430eb49f8f2f7001a9904d9b4d6a4c06493eeefe37849863c15328b", "hex")
  const header = Header.fromRaw(raw, true)
  if (!header)
    return

  let rawBody = raw.slice(header.headerLength)

  const dataWrapper = new CustomDataWrapper(rawBody)

  let res:any = deserialize(dataWrapper, header.name)
  console.log(res)

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