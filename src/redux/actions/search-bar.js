const SET_FILTER_TEXT = 'SET_FILTER_TEXT'
const SET_LOADING_FILTER_TEXT = 'SET_LOADING_FILTER_TEXT'

const actions = {
    setFilterTextAction(filterText) {
        return {
            type: SET_FILTER_TEXT,
            payload: filterText
        }
    },
    setLoadingFilterTextAction(payload){
        return {
            type: SET_LOADING_FILTER_TEXT,
            payload
        }
    }
}

export default actions;