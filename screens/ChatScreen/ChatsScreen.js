import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, AppState, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs';
import { FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native-appearance'
import firebase from 'firebase';
import io from 'socket.io-client';
import axios from 'axios';

import Chat from '../../components/Chat';
import { FlatList } from 'react-native-gesture-handler';
import * as actionTypes from '../../store/actions/UpdateMessage';
import Colors from '../../constants/Colors';

const socket = io.connect("http://192.168.0.8:5000")

const ChatsScreen = props => {
    
    const [appState, setAppState] = useState(AppState.currentState)
    const [loading, setLoading] = useState(true)
    
    const dispatch = useDispatch()

    const user_id = "6ac616295b09a0bc149f763124a2c981d7a9f58edf957531eeff14043662c668a1a06d78f375962b9e61841547d9606afcf37663dda4d67378ecc8777531de242235a4e75b4bf5944db1fd63667c2407c41e5a207c6e0f097c453b9c15897a490f1e0f30485fe3b6d238d5b5417328d571870deaad9ae6af"
    
    // const user_id = "06540cb91f7bddd40d2badd992f0ab6ff65e09d5ee3e1376bbacb08809998f4a3e6b17570286f6a1b700c4b85fb73110c61c0159d9f799edc148c1bc57e0bbed37a60b818f278782221e04c80c3ccf77697c60378a654b0b486b0ab2f255be5f146024809657f2609b7951f5427026e4bd7162b6a1c06779"

    const chats = useSelector(state => state.messageReducer.chats)
    const fastMessages = useSelector(state => state.messageReducer.fastMessages)
    const online = useSelector(state => state.messageReducer.online)
    const friends = useSelector(state => state.messageReducer.friends)

    if (chats.chats && fastMessages.length != 0 && friends.length > 0 ) {
        for (var i in fastMessages) {
            const lastMessage = fastMessages[i].messages[fastMessages[i].messages.length - 1]
            const index = chats.chats.findIndex(user => user.userId === fastMessages[i].recieverId)
            chats.chats[index].lastMessage = lastMessage.messageText
            chats.chats[index].sender = lastMessage.sender
            chats.chats[index].status = lastMessage.status
            chats.chats[index].time = lastMessage.sentTime
        }
        chats.chats.sort((a,b) => new Date(a.time) > new Date(b.time) ? -1 : 1 )
        for (var i in chats.chats) {
            for (var j in friends) {
                if ( chats.chats[i].userId === friends[j].friend_id ) {
                    chats.chats[i].dpUrl = friends[j].dpUrl
                    break
                }
            }
        }
        // console.log(chats)
    }

    const fetchChats = useCallback(async (user_id) => {
        dispatch(actionTypes.fetchChats(user_id)
        ).then(() => {
        }).
        catch(err => {
            console.log(err)
        })
    })

    const fetchFastMessages = useCallback(async (user_id) => {
        dispatch(actionTypes.fetchFastMessages(user_id)
        ).then(() => {
        }).catch(err => {
            console.log(err)
        })
    })

    const fetchOnline = useCallback(async (user_id) => {
        dispatch(actionTypes.fetchOnline(user_id)
        ).then(() => {
        }).catch(err => {
            console.log(err)
        })
    })

    const fetchFriends = useCallback(async (user_id) => {
        dispatch(actionTypes.fetchFriends(user_id)
        ).then(() => {
        }).catch(err => {
            console.log(err)
        })
    })

    useEffect(() => {
        console.log("useEffect working")
        socket.emit("newUser", {_id: user_id})
        fetchChats(user_id).then(() => {
        }).catch(error => {
            console.log(error)
        })
        fetchFastMessages(user_id).then(() => {
        }).catch(error => {
            console.log(error)
        })
        fetchOnline(user_id).then(() => {
        }).catch(error => {
            console.log(error)
        })
        fetchFriends(user_id).then(() => {
            setLoading(false)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', () => fetchOnline(user_id))
        return () => {
            willFocusSub.remove
        }
    }, [fetchOnline])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', () => fetchFastMessages(user_id))
        return () => {
            willFocusSub.remove
        }
    }, [fetchFastMessages])

    const _handleAppStateChange = (nextAppState) => {
        if (appState === 'active' && nextAppState === 'background') {
            socket.emit("disconnect")
            console.log("Closed the app")
        }
        setAppState(nextAppState)
    }

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange)
        return () => {
            AppState.addEventListener('change', _handleAppStateChange)
        }
    }, [])

    useEffect(() => {
        socket.off('privateMessageResponse')
        socket.off('privateMessageBackend')
        socket.on("privateMessageResponse", (msgDetails) => {
            dispatch(actionTypes.setPrivateMessageResponse(msgDetails))
        })
        socket.on("privateMessageBackend", (msgDetails) => {
            socket.emit("privateMessageResponseBackend", msgDetails)
        })
    }, [])

    const chatPressed = (receiver_imageUrl, receiver_name, receiver_id, _id, name, avatar, lastSeenTime) => {
        props.navigation.navigate("ChatDetail", {
            receiver_imageUrl: receiver_imageUrl, receiver_name: receiver_name, receiver_id: receiver_id,  
            _id: _id, name: name, avatar: avatar, lastSeenTime: lastSeenTime
        })
    }

    if (loading || !chats.chats || fastMessages.length === 0 || online.length === 0 ) {
        return (
            <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
                <ActivityIndicator color = {Colors.primary} size = {50} />
            </View>
        )
    }

    return (
        <View style = {{flex: 1, backgroundColor: 'white'}} >
            <FlatList data = {chats.chats} keyExtractor = {(item, index) => item._id.toString()}
                        renderItem = { itemData => <Chat name = {itemData.item.name} online = { online.filter(user => user._id === itemData.item.userId)[0].online.status }
                        image = {itemData.item.dpUrl}
                        message = 
                        {
                            itemData.item.lastMessage.length === 0 ?
                            itemData.item.type === "image" ?
                            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <FontAwesome name = "photo" color = "#ccc" size = {16} />
                                <Text style = {{fontSize: 16, color: '#666'}} >  Photo</Text>
                            </View> : 
                            itemData.item.type === "video" ?
                            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <Ionicons name = "md-videocam" color = "#ccc" size = {20} />
                                <Text style = {{fontSize: 16, color: '#666'}} >  Video</Text>
                            </View> : 
                            <View style = {{flexDirection: 'row', alignItems: 'center'}}>
                                <MaterialIcons name = "audiotrack" color = "#ccc" size = {20} />
                                <Text style = {{fontSize: 16, color: '#666'}} > Audio</Text>
                            </View> : 
                            itemData.item.type === "image" ? 
                            <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                                <FontAwesome name = "photo" color = "#ccc" size = {16} />
                                <Text style = {{fontSize: 16, color: 'black', width: '85%'}} numberOfLines = {1} >  {itemData.item.lastMessage} </Text>
                            </View> :
                            itemData.item.type === "video" ? 
                            <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                                <Ionicons name = "md-videocam" color = "#ccc" size = {20} />
                                <Text style = {{fontSize: 16, color: 'black', width: '85%'}} numberOfLines = {1} >  {itemData.item.lastMessage} </Text>
                            </View> :
                            itemData.item.type === "audio" ? 
                            <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                                <MaterialIcons name = "audiotrack" color = "#ccc" size = {20} />
                                <Text style = {{fontSize: 16, color: 'black', width: '85%'}} numberOfLines = {1} > {itemData.item.lastMessage} </Text>
                            </View> :
                            <Text style = {{fontSize: 16, width: '85%'}} numberOfLines = {1} >
                                {itemData.item.lastMessage }
                            </Text>
                        }
                        unseenCount = { itemData.item.unseenCount > 0 ? itemData.item.unseenCount : null }
                        waitingtick = { itemData.item.sender ? itemData.item.status === "waiting" ? true : false : null }
                        senttick = { itemData.item.sender ? itemData.item.status === "sent" ? true : false : null}
                        deliveredtick = { itemData.item.sender ? itemData.item.status === "delivered" ? true : false : null}
                        seentick = { itemData.item.sender ? itemData.item.status === "seen" ? true : false : null}
                        time = {
                            new Date().getDate() === new Date(itemData.item.time).getDate() ?
                            dayjs(new Date(itemData.item.time)).format("HH:mm A") :
                            new Date().getDate() - new Date(itemData.item.time).getDate() === 1 ?
                            "Yesterday" :
                            new Date(itemData.item.time).getDate() + "/" +
                            parseInt(new Date(itemData.item.time).getMonth() + 1) + "/" +
                            new Date(itemData.item.time).getFullYear()
                        }
                        onSelect = { () => chatPressed(itemData.item.dpUrl, itemData.item.name, itemData.item.userId, user_id, "Yash Kataruka", "https://scx2.b-cdn.net/gfx/news/hires/2019/2-nature.jpg" , online.filter(user => user._id === itemData.item.userId)[0].online.status ? "online" : online.filter(user => user._id === itemData.item.userId)[0].online.lastSeen ) }
                        />
            }/>
        </View>
    );
}

export default ChatsScreen;