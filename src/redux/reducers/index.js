import SearchBarReducer from './search-bar'
import PrincipalPageReducer from './principal-page'
import filterBarReducer from './filter-bar';

import { combineReducers } from 'redux'

const allReducers = combineReducers({
    searchBar: SearchBarReducer,
    principalPage: PrincipalPageReducer,
    filterBar: filterBarReducer,
})

export default allReducers