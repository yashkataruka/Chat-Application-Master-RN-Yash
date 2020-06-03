import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5, Octicons, Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

const Chat = (props) => {

    return (
        <View>
        <TouchableOpacity style = {{flexDirection: 'row', width: '95%', marginLeft: '2.5%', marginTop: 10}} onPress = {() => props.onSelect()} >
            <ImageBackground source = {{uri: props.image}} style = {{height: 60, width: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, overflow: 'hidden'}} >
            </ImageBackground>
            <View style = {{justifyContent: 'space-evenly', marginLeft: 15, width: '80%'}} >
                <View style = {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}} >
                    <Text style = {{fontSize: 18, fontWeight: 'bold'}} >{props.name}</Text>
                    <Text style = {{fontSize: 12, fontWeight: 'bold', color: '#ccc'}} >{props.time}</Text>
                </View>
                <View style = {{flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}} >
                    {props.message}
                    { props.unseenCount ? <View style = {{height: 20, width: 30, backgroundColor: Colors.primary, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }} >
                                              <Text style = {{color: 'white'}} >{props.unseenCount}</Text>
                                          </View> :
                        props.seentick ? <Ionicons name = "ios-checkmark-circle" color = {Colors.primary} size = {13} /> : 
                            props.deliveredtick ? <Ionicons name = "ios-checkmark-circle-outline" color = {Colors.primary} size = {13} /> :
                                props.senttick ? <FontAwesome5 name = "circle" color = {Colors.primary} size = {11} /> : null
                    }
                </View>
            </View>
        </TouchableOpacity>
        { props.online ? <View style = {{height: 10, width: 10, backgroundColor: Colors.primary, borderRadius: 5, marginLeft: '3.6%', top: "-15%"}}/> : <View style = {{height: 10, width: 10, backgroundColor: 'white',  borderRadius: 5, marginLeft: '3.6%'}} /> }
        <View style = {{height: 1, width: '80%', marginLeft: '17%', backgroundColor: '#ccc', }} />
        </View>

    )
}

export default Chat;