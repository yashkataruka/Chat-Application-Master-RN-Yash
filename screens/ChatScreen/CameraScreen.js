import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, PixelRatio, Switch } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera'
import { Ionicons, FontAwesome, Feather} from '@expo/vector-icons'

import Colors from '../../constants/Colors';

var FONT_SIZE = 20;

if (PixelRatio.get() >= 3) {
    FONT_SIZE = 30
}


const CameraScreen = props => {

    const [type, setType] = useState(Camera.Constants.Type.back)
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
    const [zoom, setZoom] = useState(0);
    const [pictureSizes, setPictureSizes] = useState([]);
    const [pictureSize, setPictureSize] = useState()
    const [pictureSizeId, setPictureSizeId] = useState(0)
    const [clicking, setClicking] = useState(false)
    const [camera_, setCamera] = useState(true)
    const [video_, setVideo] = useState(false)
    const [recording, setRecording] = useState(false)

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

    let camera;

    const zoomOut = () => {
        setZoom(Math.max(0,zoom-0.1));
    }

    const zoomIn = () => {
        setZoom(Math.min(1,zoom + 0.1));
    }

    const collectPictureSizes = async () => {
        if (camera) {
            const pictureSizes = await camera.getAvailablePictureSizesAsync('16:9');
            let pictureSizeId = 0;
            if (Platform.OS === 'ios') {
                pictureSizeId = pictureSizes.indexOf('High');
            } else {
                // returned array is sorted in ascending order - default size is the largest one
                pictureSizeId = pictureSizes.length - 1;
            }
            setPictureSizes(pictureSizes)
            setPictureSizeId(pictureSizeId)
            setPictureSize(pictureSizes[pictureSizeId])
        }
    };

    const previousPictureSize = () => {
        changePictureSize(-1);
    }
    
    const nextPictureSize = () => {
        changePictureSize(1);
    }

    const changePictureSize = direction => {
        let newId = pictureSizeId + direction;
        const length = pictureSizes.length;
        if (newId >= length) {
            newId = 0;
        } 
        else if (newId < 0) {
            newId = length - 1;
        }
        setPictureSize(pictureSizes[newId])
        setPictureSizeId(newId)
    };

    const snap = async () => {
        if (camera) {
            setClicking(true)
            let photo = await camera.takePictureAsync({quality: 1});
            setClicking(false)
            props.navigation.navigate("Image", {
                uri: photo.uri, 
                height: photo.height, 
                width: photo.width,
                _id: props.navigation.state.params._id,
                avatar: props.navigation.state.params.avatar,
                name: props.navigation.state.params.name,
                receiver_id: props.navigation.state.params.receiver_id,
                receiver_name: props.navigation.state.params.receiver_name,
                receiver_imageUrl: props.navigation.state.params.receiver_imageUrl
            })
        }
    };

    const video_snap = async () => {
        if (recording) {
            setRecording(false)
            camera.stopRecording()
        }
        else if (camera) {
            setRecording(true)
            let video = await camera.recordAsync({quality: Camera.Constants.VideoQuality['1080p']});
            props.navigation.navigate("VideoScreen", {uri: video.uri, send_message: true, height: video.height, 
                width: video.width,
                _id: props.navigation.state.params._id,
                avatar: props.navigation.state.params.avatar,
                name: props.navigation.state.params.name,
                receiver_id: props.navigation.state.params.receiver_id,
                receiver_name: props.navigation.state.params.receiver_name,
                receiver_imageUrl: props.navigation.state.params.receiver_imageUrl})
        }
    };

    if (!verifyPermissions()) {
        return <View><Text>Permissions not granted</Text></View>
    }

    else {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'}} >
                <Camera style={{ height: Dimensions.get("screen").width * (16/9), width: '100%', justifyContent: 'flex-end', alignItems: 'center' }} type = {type} 
                        type={type} flashMode = {flash} autoFocus = {Camera.Constants.AutoFocus.on} zoom = {zoom} whiteBalance={Camera.Constants.WhiteBalance.auto}
                        onMountError = {() => <Text>Camera Cannot be Started</Text>} useCamera2Api ref = {ref => camera = ref} ratio = "16:9"
                        // onCameraReady={collectPictureSizes} pictureSize = {pictureSize}
                >
                    {clicking ? <Text style = {{ fontSize: FONT_SIZE, color: 'white', textAlign: 'center', bottom: '30%'}} >Loading Preview...</Text> : null }
                    <View style = {{alignItems: 'flex-start', right: Dimensions.get("screen").width / 3.5 }} >
                        <Text style = {{color: 'white', fontSize: 22}} >Switch Mode</Text>
                        <Text></Text>
                        <Text style = {{color: 'white'}} >Camera</Text>
                        <Switch value = {camera_} onValueChange = {() => {
                            setCamera(!camera_)
                            setVideo(camera_)
                        }} thumbColor = {Colors.primary} trackColor = {{true: Colors.primary}} />
                        <Text style = {{color: 'white'}} >Video</Text>
                        <Switch value = {video_} onValueChange = {() => {
                            setCamera(!camera_)
                            setVideo(camera_)
                        }} thumbColor = {Colors.primary} trackColor = {{true: Colors.primary}} />
                    </View>
                    <View style = {{bottom: 110, left: Dimensions.get("screen").width / 2 - 60}}>
                        <Feather name="zoom-out" size={40} color = "white" onPress={zoomOut} style={{ padding: 6 }} />
                        <Feather name="zoom-in" size={40} color = "white" onPress={zoomIn} style={{ padding: 6 }} />   
                    </View>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: '80%', alignItems: 'center', bottom: 10}} >
                        <View style = {{height: 50, width: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center'}} >
                            <TouchableOpacity onPress = {() => { setFlash( flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off) }} >
                                { flash === Camera.Constants.FlashMode.off ? <Ionicons name = "ios-flash-off" size = {30} color = "white" /> :
                                <Ionicons name = "ios-flash" size = {30} color = "white" /> }
                            </TouchableOpacity>
                        </View>
                        <View style = {{alignItems: 'center', justifyContent: 'center'}} >
                            <TouchableOpacity onPress = {camera_ ? snap : video_snap} >
                            {camera_ ? <Ionicons name = "ios-camera" size = {70} color = "white" /> : !recording ? <FontAwesome name = "circle" size = {65} color = "white" /> : <FontAwesome name = "stop-circle" color = "#ff726f" size = {65} /> }
                            </TouchableOpacity>
                        </View>
                        <View style = {{height: 40, width: 40, borderRadius: 25, borderColor: 'white', borderWidth: 1, alignItems: 'center', justifyContent: 'center'}} >
                            <TouchableOpacity onPress = {() => { setType( type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back) }} >
                                <Ionicons name = "ios-reverse-camera" size = {30} color = "white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Camera>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default CameraScreen;