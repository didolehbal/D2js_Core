import { msg_from_id, types, types_from_id, primitives } from "./protocol.json"
import CustomDataWrapper from "./CustomDataWraper"
import BooleanByteWrapper from "./BooleanByteWrapper"

interface Anything {
    [key: string]: Message;
}
type Message = {
    name: string,
    parent: string | null,
    protocolId: number,
    vars: variable[],
    boolVars: variable[],
    hash_function: any,
}

export type variable = {
    name: string,
    length: string,
    type: string,
    optional: boolean
}
export const getMsgFromId = msg_from_id as unknown as Anything
export const getTypesFromName = types as unknown as Anything
export const getTypeFromId = types_from_id as unknown as Anything
export const getPrimitives = primitives as string[]


export function readAtomicType(data: CustomDataWrapper, desc: variable): {} {
    if (desc.optional) console.log("optional !!")
    let result = {}
    try {
        if (desc.length) {
            let length = data.read(desc.length)
            if (typeof length != "number") {
                throw new Error("length not number : " + length)
            }
            let res = []
            for (let i = 0; i < length; i++) {
                res.push(data.read(desc.type))
            }
            result = res
        }
        else {
            result = data.read(desc.type)
        }
    } catch (ex) {
        console.trace(ex)
        return "ERROR"
    }

    return result
}

export function deserialize(data: CustomDataWrapper, protocolId: number, typeId: number = -1): {} {
    if (!data || protocolId == undefined) {
        throw new Error("args missing !" + data + "" + protocolId)
    }
    let result = {}
    let msgSpec = null

    if (typeId != -1)
        msgSpec = getTypeFromId[typeId]
    else
        msgSpec = getMsgFromId[protocolId]

    if (!msgSpec) {
        throw new Error("msgSpec missing ! protocolID:" + protocolId + " " + typeId)
    }


    //handle parent
    if (msgSpec.parent != null) {
        const isMsg = msgSpec.parent.includes("Message")
        let res
        if (isMsg)
            res = deserialize(data, getTypesFromName[msgSpec.parent].protocolId)
        else
            res = deserialize(data, 1, getTypesFromName[msgSpec.parent].protocolId)
        result = { ...result, ...res }
    }

    //handle boolvars 8 by 8 (each boolvar is written in 1/8 byte)
    if (msgSpec.boolVars.length > 0) {
        for (let j = 0; j < msgSpec.boolVars.length; j += 8) {
            let _box0: number = data.readByte();
            for (let i = 0; i < 8 && i < msgSpec.boolVars.length / (j+1); i++) {
                let bool1 = msgSpec?.boolVars[i];
                result = {
                    ...result,
                    [bool1.name]: BooleanByteWrapper.getFlag(_box0, i),
                }
            }
        }
    }


    //handle vars
    msgSpec.vars.map(v => {
        if (getPrimitives.includes(v.type)) {
            let res = readAtomicType(data, v)
            result = { ...result, [v.name]: res }
        }
        else {

            if (v.length == null) {
                let type = v.type
                if (type == "ID") {
                    let id = data.readUnsignedShort()
                    type = getTypeFromId[id].name
                }
                result = { ...result, ...deserialize(data, 1, getTypesFromName[type].protocolId) }
            }
            else {
                const length = data.read(v.length)
                const res = []
                for (let i = 0; i < length; i++) {
                    let type = v.type
                    if (type == "ID") {
                        let id = data.readUnsignedShort()
                        type = getTypeFromId[id].name
                    }
                    res.push(deserialize(data, 1, getTypesFromName[type].protocolId))
                }
                result = { ...result, [v.name]: res }
            }
        }
    })
    //console.log("Done deserializing " + msgSpec.name + "\n", result)
    return result
}

export function writeAtomicType(data: CustomDataWrapper, desc: variable, value: any) {
    let length: any = 1;
    if (desc.length) {
        length = value.length
        data.write(desc.length, length)
        for (let i = 0; i < length; i++) {
            data.write(desc.type, value[i])
        }
    }
    else {
        data.write(desc.type, value)
    }
}

export function serialize(dataWrapper: CustomDataWrapper = new CustomDataWrapper(), data: any, protocolId: number): Buffer {

    let msgSpec = getMsgFromId[protocolId] || getTypeFromId[protocolId]
    //console.log("serializing " + msgSpec.name + "\n")

    if (msgSpec.parent != null) {
        serialize(dataWrapper, data, getTypesFromName[msgSpec.parent].protocolId)
    }

     //handle boolvars 8 by 8 (each boolvar is written in 1/8 byte)
     if (msgSpec.boolVars.length > 0) {
        for (let j = 0; j < msgSpec.boolVars.length; j += 8) {
            let _box0: number = 0;
            for (let i = 0; i < 8  && i < msgSpec.boolVars.length / (j+1); i++) {
                _box0 = BooleanByteWrapper.setFlag(_box0, i, data[msgSpec?.boolVars[i].name]);
            }

            dataWrapper.writeByte(_box0)
        }
    }

    msgSpec?.vars?.map(desc => {
        if (getPrimitives.includes(desc.type)) {
            writeAtomicType(dataWrapper, desc, data[desc.name])
        }
        else {
            if (desc.length == null) {
                serialize(dataWrapper, data[desc.name], getTypesFromName[desc.type].protocolId)
            }
            else {
                dataWrapper.write(desc.length, data[desc.name].length)
                for (let i = 0; i < data[desc.name].length; i++)
                    serialize(dataWrapper, data[desc.name][i], getTypesFromName[desc.type].protocolId)
            }
        }
    })
    return dataWrapper.getBuffer()
}

