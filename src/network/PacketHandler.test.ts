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

test('extractPacket', () => {
    let header = {
        packetId:45,
        lenType:1,
        length:50
    }
    const packetHandler = new PacketHandler("test",[]);

    let rawHead : Buffer = packetHandler.packHeader(header.packetId,header.length)
    expect(rawHead.length).toEqual(3)

    let buff = Buffer.concat([rawHead,Buffer.alloc(50)])
    expect(buff.length).toEqual(53)

    let { offset: newOffset,packet, rawPacket } = packetHandler.extractPacket(buff, 0)

    expect(packet.header).toEqual(header)
    expect(newOffset).toEqual(rawPacket.length)
})

