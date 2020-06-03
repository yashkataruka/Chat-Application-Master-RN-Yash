import {  SET_CHATS, UPDATE_CHATS, UPDATE_UNSEEN_COUNT, SET_FAST_MESSAGES, UPDATE_FAST_MESSAGES, SET_ONLINE, SET_FRIENDS, SET_PRIVATE_MESSAGE_RESPONSE } from "../actions/UpdateMessage"
import axios from 'axios';

const initialState = {
    chats: [],
    fastMessages: [],
    online: [],
    friends: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_CHATS:
            return {
                ...state,
                chats: action.chats
            }
        case UPDATE_CHATS:
            let oldChats = {...state.chats}
            let oldChatsChats = oldChats.chats
            const index1 = oldChatsChats.findIndex(user => user.userId === action.receiver_id)
            oldChatsChats[index1].lastMessage = action.newMessage.messageText
            oldChatsChats[index1].time = action.newMessage.sentTime
            const config = {
                headers: {
                    'Authorization': "Bearer " + action.user_id
                }
            }
            axios.post('https://chat-app76.herokuapp.com/user/messages/chats', oldChats.chats, config)
            return {
                ...state,
                chats: oldChats
            }
        case UPDATE_UNSEEN_COUNT:
            let oldChats1 = {...state.chats}
            let oldChatsChats1 = oldChats1.chats
            oldChatsChats1.forEach(user => {
                if (user.userId == action.receiver_id) {
                    user.unseenCount = 0
                }
            })
            return {
                ...state,
                chats: oldChats1
            }
        case SET_FAST_MESSAGES:
            return {
                ...state,
                fastMessages: action.fastMessages
            }
        case UPDATE_FAST_MESSAGES:
            let oldFastMessages = [...state.fastMessages]
            let oldFastMessages_receiver_id = oldFastMessages.filter(user => user.recieverId === action.receiver_id)[0].messages
            oldFastMessages_receiver_id = oldFastMessages_receiver_id.concat(action.newMessage)
            const index = oldFastMessages.findIndex(user => user.recieverId === action.receiver_id)
            oldFastMessages[index].messages = oldFastMessages_receiver_id
            return {
                ...state,
                fastMessages:  oldFastMessages
            }
        case SET_ONLINE:
            return {
                ...state,
                online: action.online
            }
        case SET_FRIENDS:
            return {
                ...state,
                friends: action.friends
            }
        case SET_PRIVATE_MESSAGE_RESPONSE:
            const oldFastMessages1 = [...state.fastMessages]
            oldFastMessages1.forEach((user) => {
                user.messages.forEach((message, index) => {
                    if (message.commonId === action.msgDetails.commonId) {
                        user.messages[index] = action.msgDetails
                    }
                })
            })
            return {
                ...state,
                fastMessages: oldFastMessages1
            }
        default:
            return state
        }
    }
