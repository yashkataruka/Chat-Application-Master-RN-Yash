import React, { useState, useEffect } from 'react';
import {View, Text, ImageBackground, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView, DeviceEventEmitter, Keyboard, Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import { useSelector, useDispatch } from 'react-redux';
import uuid from 'uuid';
import * as MediaLibrary from 'expo-media-library';

import Colors from '../../constants/Colors';
import * as actionTypes from '../../store/actions/UpdateMessage';

const ImagePreviewScreen = (props) => {

    const [message, setMessage] = useState("")
    const [visibleHeight, setVisibleHeight] = useState(90)

    const dispatch = useDispatch()
    // console.log(props.navigation)

    const keyboardDidShow = (e) => {
        let newSize = Dimensions.get('screen').height - e.endCoordinates.height
        setVisibleHeight(e.endCoordinates.height + 10 )
    }
      
    const keyboardDidHide = (e) => {
        setVisibleHeight(90)
    }

    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', keyboardDidShow.bind(this))
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', keyboardDidHide.bind(this))

    useEffect(() => {
        return () => {
            keyboardDidShowListener.remove()
            keyboardDidHideListener.remove()
        }
    }, [keyboardDidShowListener, keyboardDidHideListener])

    const finalMessage = [{_id: uuid.v4(), createdAt: new Date(), text: message.trim(), image: props.navigation.state.params.uri,
        user: { _id: props.navigation.state.params._id, avatar: props.navigation.state.params.avatar, name: props.navigation.state.params.name }
    }]

    const onPress = () => {
        MediaLibrary.saveToLibraryAsync(props.navigation.state.params.uri)
        .then(() => {
            Alert.alert("Download Complete!", "Your Image has been downloaded", [{text: "OK", style: "cancel"}]);
        })
        .catch(err => {
            console.log(err)
        })
        dispatch(actionTypes.updateMessage(props.navigation.state.params._id, props.navigation.state.params.receiver_id, finalMessage)) 
        props.navigation.navigate("ChatDetail")
    }

    return (
        <View style = {{flex: 1, alignItems: 'center', backgroundColor: 'black'}} >
            <ImageBackground resizeMode = "contain" source = {{uri: props.navigation.state.params.uri}} style = {{position: 'absolute' , left: 0, top: (Dimensions.get("screen").height - Dimensions.get("screen").width * (16/9)) / 2, height: Dimensions.get("screen").width * (16/9), width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
                <TextInput style = {{ minHeight: 50, width: Dimensions.get("screen").width - 50, bottom: visibleHeight, borderColor: 'white', borderWidth: 1, paddingLeft: 10,
                                        fontSize: 18, color: 'white', justifyContent: 'flex-end', maxHeight: 250, paddingVertical: 10, borderRadius: 10 }} multiline scrollEnabled
                                placeholderTextColor = "white" placeholder = "Type a message..." value = {message} onChangeText = {(text) => setMessage(text)}
                    />
                <TouchableOpacity style = {{position: 'absolute', right: Dimensions.get("screen").width - 130, bottom: 30}} onPress = {() => props.navigation.navigate("ChatDetail") } >
                        <View style = {{height: 40, width: 110, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40}} >
                            <Ionicons name = "md-arrow-back" color = "white" size = {23} style = {{left: 2}} />
                            <Text style = {{color: "white", fontSize: 20, right: 2}} >Discard</Text>
                        </View>
                </TouchableOpacity>
                <TouchableOpacity style = {{position: 'absolute', right: 25, bottom: 30}} onPress = {() => onPress() }>
                    <View style = {{height: 40, width: 80, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40}} >
                        <Text style = {{color: "white", fontSize: 20, left: 2}} >Send</Text>
                        <Ionicons name = "md-arrow-forward" color = "white" size = {23} style = {{right: 2}} />
                    </View>
                </TouchableOpacity>
                
            </ImageBackground>
        </View>
    )
}

export default ImagePreviewScreen;