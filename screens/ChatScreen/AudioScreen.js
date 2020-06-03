import React, { useState, useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View, Text, ActivityIndicator, TextInput, Slider } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, Feathers } from '@expo/vector-icons'
import { Audio } from 'expo-av'
import { useDispatch } from 'react-redux';
import uuid from 'uuid';

import * as actionTypes from '../../store/actions/UpdateMessage';
import Colors from '../../constants/Colors';

const AudioScreen = (props) => {

    const [message, setMessage] = useState("")
    const [startAudio, setStartAudio] = useState(false);
    const [playAudio, setPlayAudio] = useState(false);
    const [playsound, setPlaysound] = useState(null)
    const [audioTime, setAudioTime] = useState(null)
    const [loading, setLoading] = useState(false)
    const [sliderValue, setSliderValue] = useState(0)

    const dispatch = useDispatch()

    const startAudioMessage = async (track) => {
        try {
            setLoading(true)
            const settings = await Audio.setAudioModeAsync({shouldDuckAndroid : false, playThroughEarpieceAndroid: false})
            const {sound, status} = await Audio.Sound.createAsync({uri: track}, {shouldPlay: true})
            sound.setOnPlaybackStatusUpdate((sound) => {
                if (sound.positionMillis)
                {
                    setSliderValue(sound.positionMillis * (10 / (sound.durationMillis)))
                }
                if (sound.didJustFinish)
                {
                    setSliderValue(0)
                    setStartAudio(false)
                }
            })
            setLoading(false)
            setStartAudio(true)
            setPlayAudio(true)
            setPlaysound(sound)
            setAudioTime((status.durationMillis / 1000).toFixed(0))
        }
        catch(err) {
            console.log(err)
            setLoading(false)
        }
    }

    const playAudioMessage = async (playsound) => {
        if (playsound)
        {
            await playsound.playAsync()
            setPlayAudio(true)
        }
    }

    const pauseAudioMessage = async (playsound) => {
        if (playAudio) {
            await playsound.pauseAsync()
            setPlayAudio(false)
        }
    }

    const stopAudioMessage = async (playsound) => {
        await playsound.unloadAsync()
        setSliderValue(0)
        setStartAudio(false)
    }

    useEffect(() => {
        let tbd = playsound
        return async () => {
            if (tbd) {
                await tbd.unloadAsync()
            }
        }
    }, [playsound])

    const finalMessage = [{_id: uuid.v4(), createdAt: new Date(), text: message.trim(), audio: props.navigation.state.params.uri,
        user: { _id: props.navigation.state.params._id, avatar: props.navigation.state.params.avatar, name: props.navigation.state.params.name }
    }]

    const onPress = () => {
        dispatch(actionTypes.updateMessage(props.navigation.state.params._id, props.navigation.state.params.receiver_id, finalMessage)) 
        props.navigation.navigate("ChatDetail")
    }

    return (
        <View style = {{flex: 1, backgroundColor: 'grey', justifyContent: 'center', alignItems: 'center'}} >
            {loading ? <ActivityIndicator color = {Colors.primary} size = {50} /> : 
            <View style = {{backgroundColor: 'white', width: '70%', height: 150, elevation: 5, borderRadius: 20, justifyContent: 'center', alignItems: 'center' }} >
            {startAudio ? 
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: '50%'}} >
                    {
                        playAudio ? <Ionicons name = "ios-pause" size = {60} color = {Colors.primary} onPress = {() => pauseAudioMessage(playsound)}/> :
                        <Ionicons name = "ios-play" size = {60} color = {Colors.primary} onPress = {() => playAudioMessage(playsound)}/>
                    }
                    <MaterialIcons name = "stop" size = {60} color = {Colors.primary} onPress = {() => stopAudioMessage(playsound)}/>
                </View>  :
                <Ionicons name = "ios-play" size = {60} color = {Colors.primary} onPress = {() => startAudioMessage(props.navigation.state.params.uri)} /> }
            <View style = {{flexDirection: 'row', alignItems: 'center', top: 20}} >
                <Text style = {{color: Colors.primary}}>{audioTime ? "0:00" : null }</Text>
                <Slider style = {{width: '70%'}} thumbTintColor = {Colors.primary} minimumTrackTintColor = {Colors.primary} value = {sliderValue} minimumValue = {0} maximumValue = {10}/>
                <Text style = {{color: Colors.primary}}>{!audioTime ? null : (audioTime/60).toFixed(0)}{!audioTime ? null : ":"}{!audioTime ? null : audioTime%60}</Text>
            </View>
            </View>
            }
            {props.navigation.state.params.send_message ? 
            <View style = {{width: '70%', top: 50, alignItems: 'center', justifyContent: 'space-between'}}>
                <TextInput style = {{ minHeight: 50, width: '100%', borderColor: 'white', borderWidth: 1, paddingLeft: 10,
                                    fontSize: 18, color: 'white', justifyContent: 'flex-end', maxHeight: 70, paddingVertical: 10, borderRadius: 10 }} multiline scrollEnabled
                            placeholderTextColor = "white" placeholder = "Type a message..." value = {message} onChangeText = {(text) => setMessage(text)}
                />
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', top: 50, width: '100%'}} >
                    <TouchableOpacity onPress = {() => props.navigation.navigate("ChatDetail")} >
                        <View style = {{flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40, backgroundColor: Colors.primary, height: 40}} >
                            <Ionicons name = "md-arrow-back" size = {25} color = "white" />
                            <Text style = {{color: 'white', fontSize: 20}} >Discard</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => onPress()} >
                        <View style = {{flexDirection: 'row', alignItems: 'center', width: 100, justifyContent: 'space-around', borderWidth: 1, borderColor: 'white', borderRadius: 40, backgroundColor: Colors.primary, height: 40}} >
                            <Text style = {{color: 'white', fontSize: 20}} >Send</Text>
                            <Ionicons name = "md-arrow-forward" size = {25} color = "white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            : null
            }
        </View>
    )
}

AudioScreen.navigationOptions = (navData) => {
    const name = navData.navigation.state.params.name
    return {
        headerTitle: name,
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: 'grey',
            elevation: 0
        }
    }
}

export default AudioScreen;