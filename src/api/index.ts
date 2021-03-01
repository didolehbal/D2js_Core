import { serialize } from "../utils/Protocol"
import CustomDataWrapper from "../utils/CustomDataWraper"
import Header from "../utils/Header"
import { types } from "../utils/protocol.json"

export const attackPlayer = (targetId: number, targetCellId: number, friendly: boolean, hash: Buffer): Buffer => {
    const data = {
        targetId,
        targetCellId,
        friendly
    }
    const raw = serialize(new CustomDataWrapper(), data, "GameRolePlayPlayerFightRequestMessage")
    let header = new Header(types["GameRolePlayPlayerFightRequestMessage"].protocolId, raw.length + hash.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw, hash])
}
export const useObject = (objectUID: number) => {
    const data = {
        objectUID
    }
    const raw = serialize(new CustomDataWrapper(), data, "ObjectUseMessage")
    let header = new Header(types["ObjectUseMessage"].protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}
export const objects_GUID = {
    POTION_RAPPEL : 548
}
export const usePopoRappel = () => {
    const popoRappelGUID = 548 //54218816
    return useObject(popoRappelGUID)
}

export const inviteToKoliGrp = (name:string, hash:Buffer) => {
    const data = {
        name
    }
    const raw = serialize(new CustomDataWrapper(), data, "PartyInvitationArenaRequestMessage")
    let header = new Header(types["PartyInvitationArenaRequestMessage"].protocolId, raw.length + hash.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw, hash])
}
export const teleport = (mapId: number, sourceType: number, destinationType: number): Buffer => {
    const data = {
        mapId,
        sourceType,
        destinationType
    }
    const raw = serialize(new CustomDataWrapper(), data, "TeleportRequestMessage")
    let header = new Header(types["TeleportRequestMessage"].protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}
export const passeTour = (isAfk: boolean) => {

    const type = types["GameFightTurnFinishMessage"]

    const data = {
        isAfk
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}

export const readyFight = (isReady: boolean) => {
    const type = types["GameFightReadyMessage"]

    const data = {
        isReady
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}
export const joinFight = (fighterId: number, fightId: number) => {
    const type = types["GameFightJoinRequestMessage"]

    const data = {
        fighterId,
        fightId
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}
export const replyToNPC = (replyId: number) => {

    const type = types["NpcDialogReplyMessage"]

    const data = {
        replyId,
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}

export const getMapInfo=(mapId:number) => {
    
    const type = types["MapInformationsRequestMessage"]

    const data = {
        mapId,
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}

export const talkToNPC = (npcId: number, npcActionId: number, npcMapId: number) => {

    const type = types["NpcGenericActionRequestMessage"]

    const data = {
        npcId,
        npcActionId,
        npcMapId
    }
    const raw = serialize(new CustomDataWrapper(), data, type.name)
    let header = new Header(type.protocolId, raw.length, Header.GLOBAL_INSTANCE_ID + 1)

    return Buffer.concat([header.toRaw(), raw])
}
export const saveZaap = (): Buffer => {
    let header = new Header(types["ZaapRespawnSaveRequestMessage"].protocolId, 0, Header.GLOBAL_INSTANCE_ID + 1)
    return header.toRaw()
}
export const whoIsPlayer = (targetName: string, hash: Buffer): Buffer => {
    const data = {
        search: targetName,
        verbose: false
    }
    const rawbody = serialize(new CustomDataWrapper(), data, "BasicWhoIsRequestMessage")
    let header = new Header(types["BasicWhoIsRequestMessage"].protocolId, rawbody.length, Header.GLOBAL_INSTANCE_ID + 1)
    const rawMessage = Buffer.concat([header.toRaw(), rawbody, hash])
    console.log(rawMessage)
    return rawMessage
}