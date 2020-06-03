import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const UserDetailScreen = props => {

    const name = props.navigation.state.params.name
    const imageUrl = props.navigation.state.params.imageUrl

    return (
        <View style = {styles.container} >
            <ImageBackground source = {{uri: imageUrl}} style = {{width: Dimensions.get("screen").width, height: Dimensions.get("screen").height / 2 }} >
                <TouchableOpacity style = {{position: 'absolute', left: 20, top: 30}} onPress = {() => props.navigation.goBack()} >
                    <Ionicons name = "md-arrow-back" size = {24} color = "black" />
                </TouchableOpacity>
            </ImageBackground>
            <ScrollView style = {{flex: 1, backgroundColor: 'white', height: Dimensions.get("screen").height / 2, top: 15}} >
                <View style = {{height: 150, width: Dimensions.get("screen").width, elevation: 3, justifyContent: 'space-around'}} >
                    <Text style = {{color: 'black', fontSize: 25}} >{name}</Text>
                    <View style = {{width: Dimensions.get("screen").width, height: 1, backgroundColor: '#888', marginLeft: 30}} />
                    <Text style = {{color: 'white', fontSize: 25}} >{name}</Text>
                </View>
            </ScrollView>
        </View>
    )
}

UserDetailScreen.navigationOptions = navData => {
    return {
        headerTitle: '',
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        // headerTitleStyle: {
        //     top: 20,
        //     right: 60,
        //     fontSize: 25
        // },
        headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white'
    }
})

export default UserDetailScreen;