import { createStore } from 'redux'
import devToolsEnhancer from 'remote-redux-devtools';

type Action = {
  type: string,
  payload: any
}

function stateReducer(state = {}, action: Action) {
  switch (action.type) {
    case 'MapComplementaryInformationsDataMessage':
      return { ...state, map: action.payload }
    default:
      return state
  }
}


export const store = createStore(stateReducer, {},devToolsEnhancer({ hostname: "localhost", port: 8000, realtime: true, name:"D2Bot" }))
store.subscribe(() => console.log(store.getState()))

