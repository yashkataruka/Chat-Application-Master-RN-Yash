import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, Keyboard, Alert } from 'react-native';
import { Video } from 'expo-av'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import uuid from 'uuid';
import * as MediaLibrary from 'expo-media-library';

import Colors from '../../constants/Colors';
import * as actionTypes from '../../store/actions/UpdateMessage';

const VideoScreen = (props) => {

    const [message, setMessage] = useState("")
    const [visibleHeight, setVisibleHeight] = useState(90)

    const dispatch = useDispatch()

    const keyboardDidShow = (e) => {
        let newSize = Dimensions.get('screen').height - e.endCoordinates.height
        setVisibleHeight(e.endCoordinates.height + 10 )
    }
      
    const keyboardDidHide = (e) => {
        setVisibleHeight(90)
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))

    const finalMessage = [{_id: uuid.v4(), createdAt: new Date(), text: message.trim(), video: props.navigation.state.params.uri,
        user: { _id: props.navigation.state.params._id, avatar: props.navigation.state.params.avatar, name: props.navigation.state.params.name }
    }]

    useEffect(() => {
        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    })

    // console.log(finalMessage)

    const onPress = () => {
        MediaLibrary.saveToLibraryAsync(props.navigation.state.params.uri)
        .then(() => {
            Alert.alert("Download Complete!", "Your Video has been downloaded", [{text: "OK", style: "cancel"}]);
        })
        .catch(err => {
            console.log(err)
        })
        dispatch(actionTypes.updateMessage(props.navigation.state.params._id, props.navigation.state.params.receiver_id, finalMessage)) 
        props.navigation.navigate("ChatDetail")
    }

    return (
        <View style = {{flex: 1, backgroundColor: 'black'}} >
            <Ionicons name = "ios-close" color = "white" size = {40} onPress = {() => props.navigation.goBack()} style = {{marginLeft: 20, marginTop: 20}} />
            <Video source = {{uri: props.navigation.state.params.uri}} style = {{flex: 1 }} resizeMode = "contain" useNativeControls = {!props.navigation.state.params.send_message} 
                shouldPlay  isLooping usePoster />
            {props.navigation.state.params.send_message ? 
            <View style = {{alignItems: 'center'}} >
                <TextInput style = {{ minHeight: 50, width: Dimensions.get("screen").width - 50, borderColor: 'white', borderWidth: 1, paddingLeft: 10,
                                    fontSize: 18, color: 'white', justifyContent: 'flex-end', maxHeight: 250, paddingVertical: 10, borderRadius: 10 }} multiline scrollEnabled
                            placeholderTextColor = "white" placeholder = "Type a message..." value = {message} onChangeText = {(text) => setMessage(text)}
                />
                <View style = {{flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginBottom: 30, marginTop: 10}} >
                    <TouchableOpacity style = {{}} onPress = {() => props.navigation.navigate("ChatDetail") } >
                        <View style = {{height: 40, width: 110, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40}} >
                            <Ionicons name = "md-arrow-back" color = "white" size = {23} style = {{left: 2}} />
                            <Text style = {{color: "white", fontSize: 20, right: 2}} >Discard</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style = {{}} onPress = {() => onPress() }>
                        <View style = {{height: 40, width: 80, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40}} >
                            <Text style = {{color: "white", fontSize: 20, left: 2}} >Send</Text>
                            <Ionicons name = "md-arrow-forward" color = "white" size = {23} style = {{right: 2}} />
                        </View>
                    </TouchableOpacity>
                </View>
                
            </View> 
            : null }
        </View>
    )
}

VideoScreen.navigationOptions = (navData) => {
    return {
        headerTitle: "",
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: 'black',
            elevation: 0
        }
    }
}

export default VideoScreen;