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

    "PartyCannotJoinErrorMessage",

    "GameFightStartingMessage", // fight preparation started
    "GameFightTurnStartMessage",
    "GameFightTurnEndMessage",
    "GameFightEndMessage",
    "GameFightStartMessage",// fight started
    "GameFightJoinMessage",// join success
    "GameFightHumanReadyStateMessage", // a player is ready
    "GuildJoinedMessage",
    "GuildLeftMessage",
    "AllianceJoinedMessage",
    "AllianceLeftMessage",
    "GameFightLeaveMessage",
    "GameFightSpectatorJoinMessage"
    //"GameRolePlayRemoveChallengeMessage",// remove fight sword from map
]
const clientActions: string[] = [
    "PartyInvitationArenaRequestMessage",
]

export default (client_id: number, store: any): { serverActions: MsgAction[], clientActions: MsgAction[] } => {
    return {
        serverActions: serverActions.map(act => Action(act, client_id, store)),
        clientActions: clientActions.map(act => Action(act, client_id, store)),
    }
}