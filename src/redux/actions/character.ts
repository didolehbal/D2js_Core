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
    "PartyUpdateMessage",
    "GameFightStartingMessage", // fight preparation started
    "GameFightTurnStartMessage",
    "GameFightTurnEndMessage",
    "GameFightEndMessage",
    "GameFightStartMessage",// fight started
    "GameFightJoinMessage",// join success
    "GameFightHumanReadyStateMessage", // a player is ready
    //"GameRolePlayRemoveChallengeMessage",// remove fight sword from map
]
const clientActions: string[] = []

export default (client_id: number, store: any): { serverActions: MsgAction[], clientActions: MsgAction[] } => {
    return {
        serverActions: serverActions.map(act => Action(act, client_id, store)),
        clientActions: clientActions.map(act => Action(act, client_id, store)),
    }
}