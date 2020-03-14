import Header from "./Header"

test("Header to/from raw",()=>{

    const header = new Header(1,8)
    const header2 = new Header(1,8)

    expect(header.toRaw()).toEqual(header2.toRaw())
    expect(header2).toEqual(header)

})

test("Header to/from raw",()=>{

    const header = new Header(1,8,2)
    const header2 = new Header(1,8,3)

    expect(header.toRaw().length).toEqual(header2.toRaw().length)
    expect(header.protocolID).toEqual(header2.protocolID)
    expect(header.bodyLength).toEqual(header2.bodyLength)
    expect(header.instanceID).toBeLessThan(header2.instanceID)

    console.log(header2.toRaw())
    const header3 = Header.fromRaw(header2.toRaw(),true)

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