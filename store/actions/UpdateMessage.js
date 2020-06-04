import axios from 'axios';

export const SET_CHATS = "SET_CHATS"
export const UPDATE_CHATS = "UPDATE_CHATS"
export const UPDATE_UNSEEN_COUNT = "UPDATE_UNSEEN_COUNT"
export const SET_FAST_MESSAGES = "SET_FAST_MESSAGES"
export const UPDATE_FAST_MESSAGES = "UPDATE_FAST_MESSAGES"
export const SET_ONLINE = "SET_ONLINE"
export const SET_FRIENDS = "SET_FRIENDS"
export const SET_PRIVATE_MESSAGE_RESPONSE = "SET_PRIVATE_MESSAGE_RESPONSE"

export const fetchChats = (user_id) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Authorization': "Bearer " + user_id
            }
        }
        try {
            axios.get('https://chat-app76.herokuapp.com/user/messages/chats', config).then(response => {
                dispatch({
                    type: SET_CHATS,
                    chats: response.data
                })

            }).catch(err => {
                console.log(err)
            })
        }
        catch (err) {
            throw err
        }
    }
}

export const updateChats = (user_id, receiver_id, newMessage) => {
    return {
        type: UPDATE_CHATS,
        user_id: user_id,
        receiver_id: receiver_id,
        newMessage: newMessage
    }
}

export const updateUnseenCount = (ids) => {
    return {
        type: UPDATE_UNSEEN_COUNT,
        receiver_id: ids.receiver_id
    }
}

export const fetchFastMessages = (user_id) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Authorization': "Bearer " + user_id
            }
        }
        try {
            axios.get('https://chat-app76.herokuapp.com/user/messages', config).then(response => {
                dispatch({
                    type: SET_FAST_MESSAGES,
                    fastMessages: response.data
                })
            }).catch(err => {
                console.log(err)
            })
        }
        catch(err) {
            throw err
        }
    }
}

export const updateFastMessages = (receiver_id, newMessage) => {
    return {
        type: UPDATE_FAST_MESSAGES,
        receiver_id: receiver_id,
        newMessage: newMessage
    }
}

export const fetchOnline = (user_id) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Authorization': "Bearer " + user_id
            }
        }
        try {
            axios.get('https://chat-app76.herokuapp.com/user/friends/online', config).then(response => {
                dispatch({
                    type: SET_ONLINE,
                    online: response.data
                })
            }).catch(err => {
                console.log(err)
            })
        }
        catch(err) {
            console.log(err)
        }
    }
}

export const fetchFriends = (user_id) => {
    return async (dispatch) => {
        const config = {
            headers: {
                'Authorization': "Bearer " + user_id
            }
        }
        try {
            axios.get('https://chat-app76.herokuapp.com/user/friends', config).then(response => {
                dispatch({
                    type: SET_FRIENDS,
                    friends: response.data
                })
            }).catch(err => {
                console.log(err)
            })
        }
        catch(err) {
            console.log(err)
        }
    }
}

export const setPrivateMessageResponse = (msgDetails) => {
    return {
        type: SET_PRIVATE_MESSAGE_RESPONSE,
        msgDetails: msgDetails
    }
}
