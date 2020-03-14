import { createStore } from 'redux'
import devToolsEnhancer from 'remote-redux-devtools';

type Action = {
  type: string,
  payload: any
}

function stateReducer(state: any = {}, action: Action) {
  switch (action.type) {
    case 'MapComplementaryInformationsDataMessage':
      return { ...state, map: action.payload }
    case "GameContextRemoveElementMessage":
      return { ...state, map: { ...state.map, actors: state?.map?.actors?.filter((a: any) => a.contextualId !== action.payload.id) } }
    default:
      return state
  }
}


export const store = createStore(stateReducer, {}, devToolsEnhancer({ hostname: "localhost", port: 8000, realtime: true, name: "D2Bot" }))

