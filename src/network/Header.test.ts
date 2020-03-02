import Header from "./Header"


test("to/from raw",()=>{

    const header = new Header(1,1,8)
    const header2 = new Header(1,1,8)

    expect(header.toRaw()).toEqual(header2.toRaw())
    expect(header2).toEqual(header)

})