import CustomDataWrapper from './CustomDataWraper'
test('read and write short', () => {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 150
    dataWrapper.writeShort(value)
    const res = dataWrapper.readUnsignedShort()
    expect(res).toBeGreaterThanOrEqual(0)
    expect(res).toEqual(value)
})

test("read and write varInt",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = -44565
    dataWrapper.writeVarInt(value)
    const res = dataWrapper.readVarInt()
    expect(res).toEqual(value)
})

test("read and write varShort",()=> { // problem with negative when reading
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 100
    dataWrapper.write("VarShort",value)
    const res = dataWrapper.read("VarShort")
    expect(res).toEqual(value)
})
test("read and write varuhShort",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 500
    dataWrapper.write("VarUhShort",value)
    const res = dataWrapper.read("VarUhShort")
    expect(res).toEqual(value)
})
test("read and write varLong",()=> {
    const dataWrapper = new CustomDataWrapper();
    const value = -336985873
    dataWrapper.write("VarUhLong",value)
    console.log(dataWrapper.getBuffer())
    const res = dataWrapper.read("VarLong")
    console.log("eHEREx " +res)

    //expect(res).toEqual(value)
})

test("read and write varuhLong",()=> {
    /*const dataWrapper = new CustomDataWrapper();
    const value = 556655
    dataWrapper.write("VarLong",value)
    //console.log(dataWrapper.getBuffer())
    const res =  dataWrapper.read("VarUhLong")
    //console.log("eHEREx " +res)

    expect(res).toEqual(value)*/

    const dr  = new CustomDataWrapper(Buffer.from("EF8184D10E","hex"))
    
    const r = dr.read("VarUhLong")
    console.log(r)

    const b = new CustomDataWrapper()
    b.write("VarLong",r)
    let d = b.read("VarUhLong")
    console.log(b,d)
})
test("read and write utf",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = "localhost"
    dataWrapper.writeUTF(value)
    const res = dataWrapper.readUTF()
    expect(res).toEqual(value)
})

test("read and write byte",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 50
    dataWrapper.writeByte(value)
    const res = dataWrapper.readByte()
    expect(res).toEqual(value)
})



test("read and write boolean",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = false
    dataWrapper.writeBoolean(value)
    const res = dataWrapper.readBoolean()
    expect(res).toEqual(value)
})



test("read and write bytes (buffer)",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = Buffer.alloc(4)
    value.writeInt32BE(6667,0)
    dataWrapper.writeBytes(value)
    const res = dataWrapper.readInt()
    expect(res).toEqual(6667)
})


test("buffer ",()=>{
    const bf = Buffer.alloc(1)
    let d = bf.readIntBE(0,1)
    expect(d).toBeDefined()

})