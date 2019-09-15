import searchBarActions from './search-bar'
import filterBarActions from './filter-bar'
import principalPageActions from './principal-page'

const actions = {
    ...searchBarActions,
    ...principalPageActions,
    ...filterBarActions,
}

export default actions