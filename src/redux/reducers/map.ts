import { Action, MapState } from "../types"
import { DoubleToVarLong } from "../../utils/convert"

export default function (state: MapState = {}, action: Action) {
    const { data, client_id } = action.payload || { data: 0, client_id: 0 }
    switch (action.type) {
        case "MapComplementaryInformationsDataMessage":
            return {
                ...state,
                [client_id]: {
                    ...data,
                    players: data.actors
                        .filter((act: any) => act.accountId != undefined)
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
            if (data.accountId != undefined) // if actor is a player
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
            if (data.level != undefined)
                return {
                    ...state,
                    [client_id]: {
                        ...state[client_id],
                        monsters: [
                            ...state[client_id]?.monsters,
                            { ...data, }
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
        case "MapFightCountMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fightCount: data.fightCount
                }
            }
        case "GameRolePlayShowChallengeMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fights: state[client_id].fights ? [...state[client_id].fights, data] : [data]
                }
            }
        case "GameFightUpdateTeamMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fights: state[client_id].fights.map((fight: any) => {
                        if (fight.fightId != data.fightId) return fight
                        else return {
                            ...fight,
                            fightTeams: fight.fightTeams.map((team: any) => {
                                if (team.teamId != data.teamId)
                                    return team
                                else return { ...data, fightId: undefined }
                            })
                        }
                    })
                }
            }
        case "GameRolePlayRemoveChallengeMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fights: state[client_id].fights.filter((fight: any) => fight.fightId != data.fightId)
                }
            }
        default: return state
    }
}
