let initialState = {
    loading: false,
    filterText: "",
    updateVideoList: false,
}

const searchBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILTER_TEXT":
            return {
                ...state,
                filterText: action.payload
            }
        case "SET_LOADING_FILTER_TEXT":
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state
    }
}

export default searchBarReducer