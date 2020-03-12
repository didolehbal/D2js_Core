import ServerHeader from "./ServerHeader"
import ClientHeader from "./ClientHeader"

test("serverHeader to/from raw",()=>{

    const header = new ServerHeader(1,8)
    const header2 = new ServerHeader(1,8)

    expect(header.toRaw()).toEqual(header2.toRaw())
    expect(header2).toEqual(header)

})

test("clientHeader to/from raw",()=>{

    const header = new ClientHeader(1,8,0)
    const header2 = new ClientHeader(1,8,1)

    expect(header.toRaw().length).toEqual(header2.toRaw().length)
    expect(header.protocolID).toEqual(header2.protocolID)
    expect(header.bodyLength).toEqual(header2.bodyLength)
    expect(header.instanceID).toBeLessThan(header2.instanceID)

    console.log(header2.toRaw())
    const header3 = ClientHeader.fromRaw(header2.toRaw())

    expect(header2).toEqual(header3)

})

/*
test("gffhfd",()=>{

 
    const header = new Header(101,0)
    let bf = Buffer.alloc(2)
    bf.writeInt16BE(101,0)

    expect(bf.length).toEqual(Buffer.concat([bf,Buffer.alloc(0)]).length)
    expect(header.length).toEqual(0)
    expect(header.lenType).toEqual(0)
})
*/