import { Action } from "../types"
import { DoubleToVarLong } from "../../utils/convert"

export default function (state: any = {}, action: Action) {
    const { data, client_id } = action.payload || { data: 0, client_id: 0 }
    switch (action.type) {
        case "MapComplementaryInformationsDataMessage":
            return {
                ...state,
                [client_id]: {
                    ...data,
                    players: data.actors
                        .filter((act: any) => act.bonesId == 1)
                        .filter((act: any) => act.sellType == undefined)
                        .filter((act: any) => act.npcId == undefined)
                        .map((p: any) => ({ ...p, level: p.characterPower - p.contextualId })),
                    monsters: data.actors
                        .filter((act: any) => act.level)
                }
            }
        case "GameContextRemoveElementMessage":
            return {
                ...state,
                [client_id]: {
                    ...state[client_id],
                    actors: state[client_id]?.actors?.filter((a: any) => a.contextualId !== data.id),
                    players: state[client_id]?.players?.filter((a: any) => a.contextualId !== data.id),
                    monsters: state[client_id]?.monsters?.filter((a: any) => a.contextualId !== data.id),
                }
            }
        case "GameRolePlayShowActorMessage":
            if (data.bonesId == 1 && data.npcId == undefined) // if actor is a player
                return {
                    ...state,
                    [client_id]: {
                        ...state[client_id],
                        players: [
                            ...state[client_id]?.players,
                            { ...data, level: data.characterPower - data.contextualId }
                        ]
                    }
                }
            else return state
        case "UpdateMapPlayersAgressableStatusMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    players:
                        state[client_id]?.players
                            .map((player: any) => {
                                const id = DoubleToVarLong(player.contextualId)
                                if (data.playerIds.includes(id)) {
                                    const index = data.playerIds.indexOf(id)
                                    return ({ ...player, agressable: data.enable[index] == 20 ? true : false })
                                }
                                else return player
                            }
                            )
                }
            }
        case "SetCharacterRestrictionsMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    players:
                        state[client_id]?.players
                            .map((player: any) => {
                                const id = player.contextualId
                                if (data.actorId == id) {

                                    return ({ ...player, ...data })
                                }
                                else return player
                            })
                }
            }
        case "InteractiveElementUpdatedMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    interactiveElements:
                        state[client_id]?.interactiveElements?.map((element: any) => element.elementId == data.elementId ? data : element)
                }
            }

        case "StatedElementUpdatedMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    statedElements:
                        state[client_id]?.statedElements?.map((element: any) => element.elementId == data.elementId ? data : element)
                }
            }
        default: return state
}
}