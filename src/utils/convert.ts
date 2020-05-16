import CustomDataWraper from "./CustomDataWraper"
export function DoubleToVarLong(val: number) {
    if(val < 0){
        console.log("cant convert negative numbers")
        return val;
    }
    let dr = new CustomDataWraper
    dr.writeVarLong2(val)
    return dr.read("VarUhLong")
}