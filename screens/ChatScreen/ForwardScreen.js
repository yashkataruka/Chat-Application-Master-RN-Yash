import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import dayjs from 'dayjs';
import { FontAwesome, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import uuid from 'uuid';
import io from 'socket.io-client';

import Chat from '../../components/Chat';
import { FlatList } from 'react-native-gesture-handler';
import * as actionTypes from '../../store/actions/UpdateMessage';
import Colors from '../../constants/Colors';

const socket = io.connect("https://chat-app76.herokuapp.com")

const ForwardScreen = props => {

    const [selectedUsers, setSelectedUsers] = useState([])

    const dispatch = useDispatch()

    const user_id = props.navigation.state.params._id
    const message = props.navigation.state.params.message

    const chats = useSelector(state => state.messageReducer.chats)

    if (chats.chats) {
        chats.chats.sort((a,b) => new Date(a.time) > new Date(b.time) ? -1 : 1 )
    }

    const updateReceivers = (receiver_id) => {
        console.log(selectedUsers)
        const newSelectedUsers = [...selectedUsers]
        const getIndex = newSelectedUsers.findIndex(val => val._id === receiver_id)
        console.log(getIndex)
        newSelectedUsers[getIndex].selected = !!!newSelectedUsers[getIndex].selected
        setSelectedUsers(newSelectedUsers)
        console.log(selectedUsers)
    }

    useEffect(() => {
        let array = []
        for (var i in chats.chats) {
            array = array.concat({_id: chats.chats[i].userId, selected: false})
        }
        setSelectedUsers(array)
        console.log(selectedUsers)
    }, [])

    const sendMessage = () => {
        for (var i in selectedUsers) {
            if (selectedUsers[i].selected) {
                const newMessage = {
                    _id: uuid.v4(),
                    senderId: user_id,
                    recieverId: selectedUsers[i]._id,
                    sentTime: new Date().toString(),
                    messageText: message.text
                }
                socket.emit("privateMessage", newMessage)
                newMessage.sender = true
                newMessage.status = "sent"
                dispatch(actionTypes.updateFastMessages(selectedUsers[i]._id, newMessage))
                dispatch(actionTypes.updateChats(user_id, selectedUsers[i]._id, newMessage))
            }
        }
        props.navigation.navigate("ChatDetail")
    }

    return (
        <View style = {styles.coontainer} >
            <FlatList data = {chats.chats} keyExtractor = {(item, index) => item._id.toString()}
                        renderItem = { itemData => <Chat name = {itemData.item.name} image = {itemData.item.dpUrl} 
                        message = {selectedUsers.findIndex(val => val._id === itemData.item.userId) >=0 ? selectedUsers[selectedUsers.findIndex(val => val._id === itemData.item.userId)].selected ? <Text style = {{color: Colors.primary}} >SELECTED</Text> : null : null }
                        onSelect = {() => updateReceivers(itemData.item.userId)}
                        />
            }/>
            <TouchableOpacity onPress = {() => sendMessage()} >
                <View style = {{paddingVertical: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center'}} >
                    <Text style = {{color: 'white', fontSize: 20}} >Send</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

ForwardScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Forward To...',
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center'
    }
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        backgroundColor: 'white'
    }
})

export default ForwardScreen;
