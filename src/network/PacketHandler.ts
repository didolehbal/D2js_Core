
export default class PacketHandler {
    private send: Function;
    constructor(send: Function) {
        this.send = send;
    }
    public handle(data: Buffer) {
        const hiHeader = data.readUIntBE(0,2);
        let packetId = hiHeader >> 2;
        let lenType = hiHeader & 3;
        this.send({packetId,lenType});
        return {packetId,lenType}
    };
}