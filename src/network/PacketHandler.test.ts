import PacketHandler from './PacketHandler'

test('pack unpack header', () => {
    let header = {
        packetId:45,
        length:0
    }
    const packetHandler = new PacketHandler("test",[]);
    let rawHead : Buffer = packetHandler.packHeader(header.packetId,header.length)
    let unpacketHead = packetHandler.unpackHeader(rawHead,0)

    expect(unpacketHead.header.packetId).toEqual(header.packetId)
    expect(unpacketHead.header.length).toEqual(header.length)
})
