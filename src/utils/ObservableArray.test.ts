import { ObservableArrayFactory } from "./ObservableArray"
test("mock", () => {

    const array = ObservableArrayFactory<string>()

    console.log(array.items)

    array.on("push",(d:string)=>{
        console.log(d+" is pushed")
    })
    array.on("remove",(d:string)=>{
        console.log(d+" is removed")
    })

    array.push("Hello")

    array.push("World")

    array.remove("Hello")

    console.log(array.items)

    expect(array.items.length).toBe(2)
})