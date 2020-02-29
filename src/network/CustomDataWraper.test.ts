import {CustomDataWrapper} from './CustomDataWraper'

test('read and write short', () => {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 150
    dataWrapper.writeShort(value)
    const res = dataWrapper.readUnsignedShort()
    console.log(res)
    expect(res).toBeGreaterThanOrEqual(0)
    expect(res).toEqual(value)
})

test("read and write varInt",()=> {
    const dataWrapper = new CustomDataWrapper(Buffer.alloc(0));
    const value = 150
    dataWrapper.writeVarInt(150)
    const res = dataWrapper.readVarInt()
    console.log(res)
    expect(res).toEqual(value)
})