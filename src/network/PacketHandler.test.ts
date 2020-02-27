import PacketHandler from './PacketHandler'

const packetHandler = new PacketHandler(() => console.log("handled !"));
test('should have id', () => {
    const data = [0,0x12]
    let buffer = new Buffer(data)
    console.log(buffer.toString())

    const result =packetHandler.handle(buffer)
    console.log(result)

    //expect(result.packetId).toEqual(0)
})
