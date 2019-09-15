const SET_FILTER_TEXT_VIDEO = 'SET_FILTER_TEXT_VIDEO'
const SET_LOADING_FILTER_TEXT_VIDEO = 'SET_LOADING_FILTER_TEXT_VIDEO'

const actions = {
    setFilterTextVideoAction(filterText) {
        return {
            type: SET_FILTER_TEXT_VIDEO,
            payload: filterText
        }
    },
    setLoadingFilterTextVideoAction(payload){
        return {
            type: SET_LOADING_FILTER_TEXT_VIDEO,
            payload
        }
    },
}

export default actions;