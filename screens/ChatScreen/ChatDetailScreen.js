import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Modal, Button, Clipboard,
    TouchableOpacity, Platform, KeyboardAvoidingView, Alert, Dimensions, Slider } from 'react-native';
import { GiftedChat, InputToolbar, Send, Bubble, Actions, Composer, Time, Message } from 'react-native-gifted-chat';
import { Ionicons, MaterialIcons, Foundation, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Picker } from 'emoji-mart';
import { useSelector, useDispatch } from 'react-redux';
import { Video, Audio } from 'expo-av';
import Lightbox from 'react-native-lightbox';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library';
import uuid from 'uuid';
import axios from 'axios';
import io from 'socket.io-client';
import dayjs from 'dayjs';

import Colors from '../../constants/Colors';
import * as actionTypes from '../../store/actions/UpdateMessage';

const socket = io.connect("https://chat-app76.herokuapp.com")

const ChatDetailScreen = props => {

    const [recording, setRecording] = useState(false);
    const [recordingInstance, setRecordingInstance] = useState(null)
    const [loading, setLoading] = useState(true)

    const dispatch = useDispatch();

    const _id = props.navigation.state.params._id
    const avatar = props.navigation.state.params.avatar
    const name = props.navigation.state.params.name
    const receiver_id = props.navigation.state.params.receiver_id
    const receiver_name = props.navigation.state.params.receiver_name
    const receiver_imageUrl = props.navigation.state.params.receiver_imageUrl

    // console.log(_id)
    // console.log(receiver_id)

    const messages = useSelector(state => state.messageReducer.fastMessages).filter(user => user.recieverId === receiver_id)[0].messages

    let finalMessages = []
    for (var i in messages) {
        finalMessages.push({
            _id: messages[i]._id,
            createdAt: messages[i].sentTime,
            text: messages[i].messageText,
            audio: messages[i].audio,
            image: messages[i].image,
            video: messages[i].video,
            status: messages[i].status,
            user: {
                _id: messages[i].sender ? _id : messages[i].senderId === _id ? _id : receiver_id ,
                name: messages[i].sender ? name : receiver_name ,
                avatar: messages[i].sender ? avatar : receiver_imageUrl
            }
        })
    }

    useEffect(() => {
        const ids = {_id: _id, receiver_id: receiver_id}
        socket.emit("updateSeenStatus", ids)
        socket.on("updateChats", ids => {
            dispatch(actionTypes.updateUnseenCount(ids))
        })
    }, [finalMessages])
    
    const updateSeenStatus = () => {
        socket.emit("updateSeenStatus", {_id: _id, receiver_id: receiver_id})
    }

    const updateChats = () => {
        socket.on("updateChats", ids => {
            dispatch(actionTypes.updateUnseenCount(ids))
        })
    }

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', updateSeenStatus)
        return () => {
            willFocusSub.remove
        }
    }, [finalMessages])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', updateChats)
        return () => {
            willFocusSub.remove
        }
    }, [finalMessages])
    
    const verifyPermissions = async () => {
        const result = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL, Permissions.AUDIO_RECORDING);
        if (result.status !== "granted") {
            Alert.alert("Insufficient Permissions", "You need to grant Camera Permission", [{
                text: 'Okay'
            }])
            return false;
        }
        return true
    }

    const openGalleryHandler = async () => {
        const hasPermission = await verifyPermissions();
        if (!hasPermission) {
            return
        }
        const gallery = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            allowsMultipleSelection: true,
            quality: 1
        })
        if (gallery.type === "image") {
            props.navigation.navigate("Image", {
                uri: gallery.uri,
                height: gallery.height,
                width: gallery.width,
                _id: _id,
                avatar: avatar,
                name: name,
                receiver_id: receiver_id,
                receiver_name: receiver_name,
                receiver_imageUrl: receiver_imageUrl
            })
        }
        else if (gallery.type === "video") {
            props.navigation.navigate("VideoScreen", {
                send_message: true,
                uri: gallery.uri,
                height: gallery.height,
                width: gallery.width,
                _id: _id,
                avatar: avatar,
                name: name,
                receiver_id: receiver_id,
                receiver_name: receiver_name,
                receiver_imageUrl: receiver_imageUrl
            })
        }
    }

    const goToCamera = () => {
        props.navigation.navigate("Camera", {
            _id: _id,
            avatar: avatar,
            name: name,
            receiver_id: receiver_id,
            receiver_name: receiver_name,
            receiver_imageUrl: receiver_imageUrl
        })
    }

    const onSend = async (message) => {
        const newMessage = {
            _id: uuid.v4(),
            senderId: _id,
            recieverId: receiver_id,
            sentTime: new Date().toString(),
            messageText: message[0].text
        }
        socket.emit("privateMessage", newMessage)
        newMessage.sender = true
        newMessage.status = "sent"
        dispatch(actionTypes.updateFastMessages(receiver_id, newMessage))
        dispatch(actionTypes.updateChats(_id, receiver_id, newMessage))
    }

    const stopAudioRecording = async () => {
        setRecording(false)
        const status = await recordingInstance.getStatusAsync()
        await recordingInstance.stopAndUnloadAsync()
        const uri = recordingInstance.getURI()
        props.navigation.navigate("Audio", {
            uri: uri, 
            send_message: true, 
            _id: _id,
            avatar: avatar,
            name: name,
            receiver_id: receiver_id,
            receiver_name: receiver_name,
            receiver_imageUrl: receiver_imageUrl})
    }

    const renderInputToolbar = (props) => {
        if (!recording)
        {
            return (
                <InputToolbar {...props} containerStyle={styles.inputToolbarStyle}
                    primaryStyle = {{alignItems: 'flex-end', borderColor: '#888', width: '89%', 
                    borderWidth: 1, borderRadius: 40, backgroundColor: 'white'}}
                />
            )
        }
        else
        {
            return (
                <View style = {{alignItems: 'center', backgroundColor: 'white', bottom: 100, width: '100%', padding: 20}} >
                    <Ionicons name = "ios-mic" size = {26}/>
                    <View style = {{marginVertical: 10}} >
                        <Text>Recording Audio using Mic...</Text>
                    </View>
                    <View style = {{width: 80}} >
                        <Button title = "Stop" color = {Colors.primary} onPress = {stopAudioRecording} />
                    </View>
                </View>
            )
        }
        
    }

    const renderSend = (props) => {
        return <Send {...props}
                containerStyle = {{alignItems: 'center', justifyContent: 'center', right: 10}}
                textStyle = {{color: Colors.primary}}
                children = {<Ionicons name = "md-send" size = {25} color = '#888' />}
               />
    }

    const videoScreen = (uri) => {
        props.navigation.navigate("VideoScreen", {uri: uri})
    }

    const audioScreen = (audio, name) => {
        props.navigation.navigate("Audio", {
            uri: audio,
            name: name
        })
    }

    const DEFAULT_OPTION_TITLES = ['Forward', 'Copy Text', 'Cancel'];

    const DEFAULT_OPTION_TITLES_2 = ['Download', 'Forward', 'Copy Text', 'Cancel']

    const forwardMessage = (currentMessage) => {
        props.navigation.navigate("Forward", {
            message: currentMessage,
            _id: _id,
            name: name,
            avatar: avatar
        })
    }

    const _onOpenActionSheet = (currentMessage) => {
        if (currentMessage.video || currentMessage.image) {
            const options = DEFAULT_OPTION_TITLES_2
            const destructiveButtonIndex = 3;
            const cancelButtonIndex = 3;
            props.showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                },
                buttonIndex => {
                    if (buttonIndex == 0) {
                        const hasPermission = verifyPermissions();
                        if (hasPermission) {
                            if (currentMessage.video) {
                                if (currentMessage.video.slice(0, 4) === "file")
                                {
                                    MediaLibrary.saveToLibraryAsync(currentMessage.video)
                                    .then(() => {
                                        Alert.alert("Download Complete!", "Your Video has been downloaded", [{text: "OK", style: "cancel"}]);
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                                else {
                                    FileSystem.downloadAsync(currentMessage.video, FileSystem.cacheDirectory + uuid.v4() + '.mp4')
                                    .then(( {uri} ) => {
                                        MediaLibrary.saveToLibraryAsync(uri)
                                        .then(() => {
                                            Alert.alert("Download Complete!", "Your Video has been downloaded", [{text: "OK", style: "cancel"}]);
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                            }
                            if (currentMessage.image) {
                                if (currentMessage.image.slice(0, 4) === "file")
                                {
                                    MediaLibrary.saveToLibraryAsync(currentMessage.image)
                                    .then(() => {
                                        Alert.alert("Download Complete!", "Your Image has been downloaded", [{text: "OK", style: "cancel"}]);
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                                else {
                                    FileSystem.downloadAsync(currentMessage.image, FileSystem.cacheDirectory + uuid.v4() + '.jpg')
                                    .then(( {uri} ) => {
                                        MediaLibrary.saveToLibraryAsync(uri)
                                        .then(() => {
                                            Alert.alert("Download Complete!", "Your Image has been downloaded", [{text: "OK", style: "cancel"}]);
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                    })
                                    .catch(err => {
                                        console.log(err)
                                    })
                                }
                            }
                        }
                    }
                    else if (buttonIndex == 1) {
                        forwardMessage(currentMessage)
                    }
                    else if (buttonIndex == 2){
                        Clipboard.setString(currentMessage.text);
                    }
                },
            );
        }
        else {
            const options = DEFAULT_OPTION_TITLES
            const destructiveButtonIndex = 2;
            const cancelButtonIndex = 2;
            props.showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                },
                buttonIndex => {
                    if (buttonIndex == 0) {
                        forwardMessage(currentMessage)
                    }
                    else if (buttonIndex == 1){
                        Clipboard.setString(currentMessage.text);
                    }
                },
            );
        }
    };

    const renderBubble = (props) => {
        return <Bubble {...props} tickStyle = {{justifyContent: 'center'}} bottomContainerStyle = {{right: {justifyContent: 'space-between'}}}
        wrapperStyle = {{right: {backgroundColor: Colors.primary, marginBottom: 2, maxWidth: '70%'},
                        left: {marginBottom: 3, backgroundColor: '#D1EEEE', maxWidth: '70%'}}} 
                        renderMessageVideo = {() => {
                            return (
                                <View style = {props.containerStyle} >
                                    <TouchableOpacity onPress = {() => videoScreen(props.currentMessage.video)} >
                                        <Video source = {{uri: props.currentMessage.video }} style = {{width: 150, height: 100, borderRadius: 13, margin: 3}} resizeMode = "contain"
                                            {...props.videoProps} />
                                    </TouchableOpacity>
                                </View>
                            )
                        }}
                        renderMessageAudio = {() => {
                            return (
                                <View style = {{alignItems: 'center', marginTop: 10}} >
                                    <Ionicons name = "ios-play" color = "black" size = {30} onPress = {() => audioScreen(props.currentMessage.audio, props.currentMessage.user.name)} />
                                </View>
                            )
                        }} 
                        onLongPress = {() => _onOpenActionSheet(props.currentMessage)}
                        renderTicks = {() => {
                            if ( props.currentMessage.user._id === _id ) {
                                if (props.currentMessage.status == "seen")
                                {
                                    return (
                                        <Ionicons name = "ios-checkmark-circle" color = "white" size = {11} style = {{right: 4}} />
                                    )
                                }
                                else if (props.currentMessage.status == "delivered") {
                                    return (
                                        <Ionicons name = "ios-checkmark-circle-outline" color = "white" size = {11} style = {{right: 4}} />
                                    )
                                }
                                else {
                                    return (
                                        <FontAwesome5 name = "circle" color = "white" size = {9} style = {{right: 4}} />
                                    )
                                }
                            }
                        }}
    
        />
    }

    const renderActions = (props) => {
        return (
            <View style = {{flexDirection: 'row', justifyContent: 'flex-start'}} >
                <Actions {...props}
                    containerStyle = {{justifyContent: 'center', alignItems: 'center'}}
                    icon = {() => <Ionicons name = "ios-camera" size = {30} color = '#888' />}
                    // options = {{"Photo": takeImageHandler, "Video": takeVideoHandler}}
                    onPressActionButton = {goToCamera}
                />
                <Actions {...props}
                    containerStyle = {{justifyContent: 'center', alignItems: 'center'}}
                    icon = {() => <Ionicons name = "ios-add" size = {30} color = '#888' style = {{right: 10}} />}
                    options = {{"Choose from Gallery": openGalleryHandler, "Cancel": () => {}}}
                />
            </View>
        )
    }

    const renderComposer = (props) => {
        return <Composer {...props}
            textInputStyle = {{fontSize: 16, right: 18}}
        />
    }

    const renderMessage = (props) => {
        return <Message {...props}
          customTextStyle={{ fontSize: 16, lineHeight: 18, paddingTop: 5, paddingBottom: 0 }} />
    }

    const renderTime = (props) => {
        return <Time {...props} timeTextStyle = {{right: {color: '#888'}}}
            />
    }

    const startAudioRecording = async () => {
        setRecording(true)
        const recordingInst = new Audio.Recording()
        setRecordingInstance(recordingInst)
        try {
            await recordingInst.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY)
            await recordingInst.startAsync()
        }
        catch(err) {
            setRecording(false)
            console.log(err)
        }
    }

    const renderAccessory = (props) => {
        return (
            <TouchableOpacity onPress = {() => console.log("Audio")} onLongPress = {startAudioRecording} >
                <View style = {{width: 44, height: 44, borderRadius: 22,
                                borderWidth: 1, borderColor: "#888",
                                justifyContent: 'center', alignItems: 'center' }} >
                    <Ionicons name = "md-mic" size = {25} color = "#888" />
                </View>
            </TouchableOpacity>
        )
    }

    // if (loading) {
    //     return (
    //         <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}} >
    //             <ActivityIndicator color = {Colors.primary} size = {30} />
    //         </View>
    //     )
    // }

    return (
        <KeyboardAvoidingView style = {{flex: 1, backgroundColor: 'white'}} >
            <GiftedChat messages = {finalMessages} onSend = {(message) => onSend(message)}
                user = {{_id: _id, name: name, avatar: avatar}}
                messagesContainerStyle = {{backgroundColor: 'white', bottom: 5}} scrollToBottom
                renderAvatarOnTop inverted = {false} renderInputToolbar = {renderInputToolbar}  renderFooter = {() => null}
                bottomOffset = {0} renderSend = {renderSend} renderBubble = {renderBubble} renderActions = {renderActions}
                renderComposer = {renderComposer} renderMessage = {renderMessage} renderAccessory = {renderAccessory}
                renderTime = {renderTime} infiniteScroll minInputToolbarHeight = {22}
            />
        </KeyboardAvoidingView>
    )
}

ChatDetailScreen.navigationOptions = navData => {
    const receiver_name = navData.navigation.state.params.receiver_name
    const receiver_imageUrl = navData.navigation.state.params.receiver_imageUrl
    const lastSeenTime = navData.navigation.state.params.lastSeenTime 
    const finalLastSeenTime = lastSeenTime === "online" ? "online" : new Date().getDate() === new Date(lastSeenTime).getDate() ?
                            dayjs(new Date(lastSeenTime)).format("HH:mm A") :
                            new Date().getDate() - new Date(lastSeenTime).getDate() === 1 ? "Yesterday at " + dayjs(new Date(lastSeenTime)).format("HH:mm A") :
                            new Date(lastSeenTime).getDate() + "/" + parseInt(new Date(lastSeenTime).getMonth() + 1) + "/" + new Date(lastSeenTime).getFullYear()
    return {
        headerTitle: () => {
            return (
            <View style = {{alignItems: 'center', top: 5}} >
                <Text style = {{color: 'white', fontSize: 20, fontWeight: 'bold'}} >{receiver_name}</Text>
                {finalLastSeenTime === "online" ? <Text style = {{color: 'white'}}>online</Text> : <Text style = {{color: 'white'}}>last seen  - {finalLastSeenTime}</Text> }
            </View>
            )
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerRight: () => {
            return (
            <TouchableOpacity onPress = {() => navData.navigation.navigate("UserDetail", {name: receiver_name, imageUrl: receiver_imageUrl })}  style = {{right: 10}} >
                <Ionicons name = "ios-menu" size = {25} color = "white" style = {{}} />
            </TouchableOpacity>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputToolbarStyle: {
        flexDirection: 'row',
        borderTopWidth: 0,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 3,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 44,
        bottom: 0
    }
})

export default connectActionSheet(ChatDetailScreen);
