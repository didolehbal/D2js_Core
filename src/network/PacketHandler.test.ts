import PacketHandler from './PacketHandler'
import SelectedServerDataMessage from '../ankama/SelectedServerDataMessage';
import SelectedServerDataExtendedMessage from '../ankama/SelectedServerDataExtendedMessage';
import Header from './Header';
test('extractPacket', () => {

    const header = new Header(45, 1, 50)

    const packetHandler = new PacketHandler("test", []);

    const rawHead: Buffer = header.toRaw() //packetHandler.packHeader(header.packetId, header.length)
    expect(rawHead.length).toEqual(3)

    const buff = Buffer.concat([rawHead, Buffer.alloc(50)])

    expect(buff.length).toEqual(53)

    const { offset: newOffset, header: sameHeader, rawPacket } = packetHandler.extractPacket(Buffer.concat([buff, buff, buff]), 0)

    expect(sameHeader).toEqual(header)
    expect(newOffset).toEqual(rawPacket.length)


    const { offset: newOffset2, header: sameHeader2, rawPacket: rawPacket2 } = packetHandler.extractPacket(Buffer.concat([buff, buff, buff]), newOffset)

    expect(sameHeader2).toEqual(header)
    expect(newOffset2).toEqual(newOffset + rawPacket2.length)


    const { offset: newOffset3, header: sameHeader3, rawPacket: rawPacket3 } = packetHandler.extractPacket(Buffer.concat([buff, buff, buff]), newOffset2)

    expect(sameHeader3).toEqual(header)
    expect(newOffset3).toEqual(newOffset2 + rawPacket3.length)
})



test("processChunk ", () => {
    const packetHandler = new PacketHandler("test", []);
    let chunk: Buffer = new Buffer("0029040000000600594600000c6469646f6c656862616c653300157265696e666f7263656d656e744c6561726e696e67088727dc00000042770744771200004120dbf600000000427709ffff6480000165160168ef01001a7468616e6174656e612e616e6b616d612d67616d65732e636f6d0002000015b3000001bb0020e3edab45fba8e46269e1b2e92a9e898621fbf6aed49f87f4a716e57b81408fff001202320403000005000000000000000002d2010003000004000000000000000000cb010003000004000000000000000002ce010003000004000000000000000002d1010003000004000000000000000002d4010003000004000000000000000002240003000004000000000000000002ef010103000505427709cdee70b00000c9010003000004000000000000000000cc010003000004000000000000000002cf010003000004000000000000000002160103000000000000000000000003de0100030001054277079528e0100000630303000005000000000000000000ca010003000004000000000000000002cd010003000004000000000000000002d0010003000004000000000000000002d30100030000040000000000000000", "hex")
    expect(chunk.readUInt16BE(0)).toEqual(41)
    /* for (let i = 0; i > 5; i++) {
        const smd = new SelectedServerDataMessage()
        const smde = new SelectedServerDataExtendedMessage()
        chunk = Buffer.concat([chunk, smd.pack(), smde.pack()])
    }
*/

    const processesData: Buffer = packetHandler.processChunk(chunk)

    expect(chunk).toEqual(processesData)

})