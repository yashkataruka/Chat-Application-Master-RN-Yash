import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { Video } from 'expo-av'
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as actionTypes from '../../store/actions/UpdateMessage';

const VideoPreviewScreen = (props) => {

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

    const finalMessage = [{_id: new Date(), createdAt: new Date(), sent: true, received: false, text: message.trim(), video: props.navigation.state.params.uri,
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
        dispatch(actionTypes.updateMessage(props.navigation.state.params._id, props.navigation.state.params.receiver_id, finalMessage)) 
        props.navigation.navigate("ChatDetail")
    }

    // console.log(props.navigation)

    return (
        <View style = {{flex: 1, alignItems: 'center', backgroundColor: 'black'}} >
            <Video source = {{uri: props.navigation.state.params.uri}} rate={1.0} volume={1.0} isMuted={false} resizeMode = "contain" shouldPlay isLooping useNativeControls
                style={{position: 'absolute', top: (Dimensions.get("screen").height - Dimensions.get("screen").width * (16/9)) / 2, height: Dimensions.get("screen").width * (16/9), width: '100%'}}
            />
            <View style = {{height: Dimensions.get("screen").height, justifyContent: 'flex-end'}} >
                <View style = {{flexDirection: 'row', justifyContent: 'space-between'}} >
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
                <TextInput style = {{ minHeight: 50, width: Dimensions.get("screen").width - 50, bottom: visibleHeight + 20, borderColor: 'white', borderWidth: 1, paddingLeft: 10,
                                    fontSize: 18, color: 'white', justifyContent: 'flex-end', maxHeight: 250, paddingVertical: 10, borderRadius: 10 }} multiline scrollEnabled
                            placeholderTextColor = "white" placeholder = "Type a message..." value = {message} onChangeText = {(text) => setMessage(text)}
                />
            </View>
        </View>

    )
}

export default VideoPreviewScreen;

// http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4
// http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4