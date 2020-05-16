import { Action } from "./"
import { MsgAction } from "../types"

const serverActions: string[] = [
    "MapComplementaryInformationsDataMessage",
    "UpdateMapPlayersAgressableStatusMessage",
    "GameRolePlayShowActorMessage",
    "GameContextRemoveElementMessage",
    "SetCharacterRestrictionsMessage",
    "InteractiveElementUpdatedMessage",
    "StatedElementUpdatedMessage"
]
const clientActions: string[] = []

export default (client_id: number, store: any): { serverActions: MsgAction[], clientActions: MsgAction[] } => {
    return {
        serverActions: serverActions.map(act => Action(act, client_id, store)),
        clientActions: clientActions.map(act => Action(act, client_id, store)),
    }
}