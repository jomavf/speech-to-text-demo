let initialState = {
    principalVideo: "",
    principalTitle: "",
    resultList: [],
}

const principalPageReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_PRINCIPAL_VIDEO":
            return {
                ...state,
                principalVideo: action.payload
            }
        case "SET_PRINCIPAL_TITLE":
            return {
                ...state,
                principalTitle: action.payload
            }
        case "SET_RESULT_LIST":
            return {
                ...state,
                resultList: action.payload
            }
        default:
            return state
    }
}

export default principalPageReducer