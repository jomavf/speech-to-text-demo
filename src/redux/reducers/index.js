import SearchBarReducer from './search-bar'

import { combineReducers } from 'redux'

const allReducers = combineReducers({
    searchBar: SearchBarReducer,
})

export default allReducers