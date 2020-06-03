import firebase from 'firebase';

export const UPDATE_LAST_SEEN = "UPDATE_LAST_SEEN"
export const SET_LAST_SEEN = "SET_LAST_SEEN"

export const fetchLastSeen = () => {
    return async (dispatch) => {
        try {
            const response = await firebase.database().ref("LastSeen/").once('value', (snapshot) => {
                snapshot.val()
            })
            let response_1 = []
            for (var i in response.toJSON()) {
                response_1 = response_1.concat(response.toJSON()[i])
            }
            dispatch({
                type: SET_LAST_SEEN,
                lastSeen: response_1
            })
        }
        catch(err) {
            throw err
        }
    }
}

export const updateLastSeen = (_id, time) => {
    return async (dispatch) => {
        try {
            await firebase.database().ref("LastSeen/").child(_id).update({
                lastSeenTime: time
            })
            dispatch({
                type: UPDATE_LAST_SEEN,
                _id: _id,
                time: time
            })
        }
        catch(err) {
            throw err
        }
    }
}
