import { createStore, combineReducers } from 'redux'
import devToolsEnhancer from 'remote-redux-devtools';
import reducers from "./reducers"



export const store = createStore(
reducers, {},
 devToolsEnhancer({
    hostname: "localhost",
    port: 8000,
    realtime: true,
    name: "D2Bot"
  })
)