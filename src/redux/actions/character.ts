import { Action } from "./"
import { MsgAction } from "../types"

const serverActions: string[] = [
    "InventoryContentMessage",
    "CharacterSelectedSuccessMessage",
    "AllianceMembershipMessage",
    "PartyJoinMessage",
    "PartyLeaveMessage",
    "PartyKickedByMessage",
    "PartyDeletedMessage",
    "PartyMemberInStandardFightMessage",
    "PartyNewMemberMessage",
    "GameFightStartingMessage",
    "GameFightTurnStartMessage",
    "GameFightTurnEndMessage",
    "GameFightEndMessage"
]
const clientActions: string[] = []

export default (client_id: number, store: any): { serverActions: MsgAction[], clientActions: MsgAction[] } => {
    return {
        serverActions: serverActions.map(act => Action(act, client_id, store)),
        clientActions: clientActions.map(act => Action(act, client_id, store)),
    }
}