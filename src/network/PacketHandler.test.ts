import PacketHandler from './PacketHandler'
import SelectedServerDataMessage from '../ankama/SelectedServerDataMessage';
import SelectedServerDataExtendedMessage from '../ankama/SelectedServerDataExtendedMessage';

test('pack unpack header', () => {
    let header = {
        packetId: 45,
        length: 0
    }
    const packetHandler = new PacketHandler("test", []);
    let rawHead: Buffer = packetHandler.packHeader(header.packetId, header.length)
    let unpacketHead = packetHandler.unpackHeader(rawHead, 0)

    expect(unpacketHead.header.packetId).toEqual(header.packetId)
    expect(unpacketHead.header.length).toEqual(header.length)
})

test('extractPacket', () => {
    const header = {
        packetId: 45,
        lenType: 1,
        length: 50
    }
    const packetHandler = new PacketHandler("test", []);

    const rawHead: Buffer = packetHandler.packHeader(header.packetId, header.length)
    expect(rawHead.length).toEqual(3)

    const buff = Buffer.concat([rawHead, Buffer.alloc(50)])
    expect(buff.length).toEqual(53)

    const { offset: newOffset, packet, rawPacket } = packetHandler.extractPacket(buff, 0)

    expect(packet.header).toEqual(header)
    expect(newOffset).toEqual(rawPacket.length)
})



test("processChunk ", () => {
    const packetHandler = new PacketHandler("test", []);
    let chunk: Buffer = Buffer.alloc(0)
    for (let i = 0; i > 5; i++) {
        const smd = new SelectedServerDataMessage()
        const smde = new SelectedServerDataExtendedMessage()
        chunk = Buffer.concat([chunk, smd.pack(), smde.pack()])
    }

    const processesData: Buffer = packetHandler.processChunk(chunk)

    expect(chunk).toEqual(processesData)

})