import PacketHandler from './PacketHandler'
import SelectedServerDataMessage from '../ankama/SelectedServerDataMessage';
import SelectedServerDataExtendedMessage from '../ankama/SelectedServerDataExtendedMessage';
import Header from './Header';
test('extractPacket', () => {
    
    const header = new Header(45,1,50)
    const packetHandler = new PacketHandler("test", []);

    const rawHead: Buffer = header.toRaw() //packetHandler.packHeader(header.packetId, header.length)
    expect(rawHead.length).toEqual(3)

    const buff = Buffer.concat([rawHead, Buffer.alloc(50)])
    expect(buff.length).toEqual(53)

    const { offset: newOffset, header:sameHeader, rawPacket } = packetHandler.extractPacket(buff, 0)

    expect(sameHeader).toEqual(header)
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