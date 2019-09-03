import SearchBarReducer from './search-bar'
import PrincipalPageReducer from './principal-page'

import { combineReducers } from 'redux'

const allReducers = combineReducers({
    searchBar: SearchBarReducer,
    principalPage: PrincipalPageReducer,
})

export default allReducers