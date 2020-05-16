import { Action } from "../types"
import { DoubleToVarLong } from "../../utils/convert"

export default function (state: any = {}, action: Action) {
    const { data, client_id } = action.payload || { data: 0, client_id: 0 }
    switch (action.type) {
        case "CharacterSelectedSuccessMessage":
            return {
                ...state,
                [client_id]: {
                    ...data
                }
            }
        case "AllianceMembershipMessage":
            return {
                ...state,
                [client_id]: {
                    ...state[client_id], ...data
                }
            }
        case "InventoryContentMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id], inventory: data
                }
            }
        case "PartyJoinMessage":
            if (data.partyType != 1) // not a groupe maybe a kolizum(idc abt it atm)
                return state
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: {
                        ...data
                    }
                }
            }
        case "PartyLeaveMessage":
            if (state[client_id]?.groupe?.partyId != data.partyId)
                return state
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: null
                }
            }
        case "PartyKickedByMessage":
            if (state[client_id]?.groupe?.partyId != data.partyId)
                return state
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: null
                }
            }
        case "PartyDeletedMessage":
            if (state[client_id]?.groupe?.partyId != data.partyId)
                return state
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: null
                }
            }
        case "PartyMemberInStandardFightMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: {
                        ...state[client_id].groupe,
                        memberFightInMap: {
                            ...data
                        }
                    }
                }
            }
        case "PartyNewMemberMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    groupe: {
                        ...state[client_id].groupe,
                        members: [
                            ...state[client_id].groupe.members,
                            data
                        ]
                    }
                }
            }
        case "GameFightStartingMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fight: {
                        ...state[client_id]?.fight,
                        inFight: true,
                        isMyTurn: false
                    }
                }
            }
        case "GameFightEndMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fight: {
                        ...state[client_id]?.fight,
                        inFight: false,
                        isMyTurn: false
                    }
                }
            }
        case "GameFightTurnStartMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fight: {
                        ...state[client_id]?.fight,
                        isMyTurn: state[client_id].id == DoubleToVarLong(data.id)
                    }
                }
            }
        case "GameFightTurnEndMessage":
            return {
                ...state, [client_id]: {
                    ...state[client_id],
                    fight: {
                        ...state[client_id]?.fight,
                        isMyTurn: !(state[client_id].id == DoubleToVarLong(data.id))
                    }
                }
            }
        default:
            return state
    }
}
