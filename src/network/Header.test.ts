import Header from "./Header"


test("to/from raw",()=>{

    const header = new Header(1,1,8)
    const header2 = new Header(1,1,8)

    expect(header.toRaw()).toEqual(header2.toRaw())
    expect(header2).toEqual(header)

})


test("gffhfd",()=>{

 
    const header = new Header(101,0,0)
    let bf = Buffer.alloc(2)
    bf.writeInt16BE(101,0)

    expect(bf.length).toEqual(Buffer.concat([bf,Buffer.alloc(0)]).length)
    expect(header.length).toEqual(0)
    expect(header.lenType).toEqual(0)
})