import { UPDATE_LAST_SEEN, SET_LAST_SEEN } from "../actions/UpdateLastSeen"

// const initialState = {
//     lastSeen: [
//         { _id: 1, lastSeenTime: "online"},
//         { _id: 2, lastSeenTime: "online"},
//         { _id: 3, lastSeenTime: "online"},
//         { _id: 4, lastSeenTime: "09:37"}
//     ]
// }

const initialState = {
    lastSeen: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_LAST_SEEN:
            return {
                ...state,
                lastSeen: action.lastSeen
            }
        case UPDATE_LAST_SEEN:
            const _id = action._id
            const oldState = [...state.lastSeen]
            const index = oldState.findIndex(user => user._id === _id)
            if (index >= 0) {
                oldState[index].lastSeenTime = action.time
            }
            return {
                ...state,
                lastSeen: oldState
            }
        default:
            return state
    }
}