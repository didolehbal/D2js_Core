import {combineReducers } from 'redux'
import CharacterReducer from "./character"
import MapReducer from "./map"

export default combineReducers({
    character:CharacterReducer,
    map:MapReducer,
})

/*import { Action } from "../types"

export default function (state: any = {}, action: Action) {
    const { data, client_id } = action.payload || { data: 0, client_id: 0 }
    switch (action.type) {
        case "EX":
            return {
                ...state,
                [client_id]: {
                    ...data
                }
            }
        default:
            return state
    }
}
*/