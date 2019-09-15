let initialState = {
    loading: false,
    filterTextVideo: "",
}

const filterBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILTER_TEXT_VIDEO":
            return {
                ...state,
                filterTextVideo: action.payload
            }
        case "SET_LOADING_FILTER_TEXT_VIDEO":
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state
    }
}

export default filterBarReducer