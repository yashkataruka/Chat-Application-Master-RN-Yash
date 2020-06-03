import firebase from 'firebase';

export const SET_USERS = "SET_USERS"
export const UPDATE_USERS = "UPDATE_USERS"

export const fetchUsers = () => {
    return async (dispatch) => {
        try {
            const response = await firebase.database().ref("Users/").once('value', (snapshot) => {
                snapshot.val()
            })
            let response_1 = []
            for (var i in response.toJSON()) {
                response_1 = response_1.concat(response.toJSON()[i])
            }
            dispatch({
                type: SET_USERS,
                users: response_1
            })
        }
        catch(err) {
            throw err
        }
    }
}

export const updateUsers = (newUser) => {
    return {
        type: UPDATE_USERS,
        newUser: newUser
    }
}