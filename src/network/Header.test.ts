import Header from "./Header"


test("to/from raw",()=>{

    const header = new Header(1,1,8)
    let rawHeader = header.toRaw()
    const sameHeader = Header.fromRaw(rawHeader)

    expect(header).toEqual(sameHeader)
    
})