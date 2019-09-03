let initialState = {
    loading: false,
    filterText: "",
}

const searchBarReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_FILTER_TEXT":
            return {
                ...state,
                filterText: action.payload
            }
        default:
            return state
    }
}

export default searchBarReducer