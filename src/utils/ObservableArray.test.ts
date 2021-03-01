import { ObservableArrayFactory } from "./ObservableArray"
test("mock", () => {

    const array = ObservableArrayFactory<string>()

   
    array.push("1")
    array.push("2")
    array.push("3")
    array.remove("1")
    

    

    console.log(array.items)

    expect(array.items.length).toBe(2)
})