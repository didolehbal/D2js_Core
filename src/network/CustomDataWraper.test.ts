import {CustomDataWrapper} from './CustomDataWraper'

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
    const value = -600000
    dataWrapper.writeVarInt(value)
    const res = dataWrapper.readVarInt()
    expect(res).toEqual(value)
})

test("read and write varShort",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = -1
    dataWrapper.writeVarShort(value)
    const res = dataWrapper.readVarShort()
    expect(res).toEqual(value)
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