import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'

import ChatNavigator from '../../navigator/ChatNavigator';
import Colors from '../../constants/Colors';

const HomeScreen = props => {

    // const headerShown = useSelector(state => state.homeHeaderReducer.homeHeaderVisible)

    // console.log(headerShown)

    return (
        <ChatNavigator />    
    );
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

HomeScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTitle: 'Home',
        headerTitleAlign: 'center',
        headerTintColor: 'white',
        headerRight: () => {
            return (
                <View style = {{flexDirection: 'row'}} >
                    <TouchableOpacity>
                        <Ionicons name = "md-search" size = {25} color = 'white' style = {{marginRight: 20}} />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name = "md-add" size = {25} color = 'white' style = {{marginRight: 20}} />
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

export default HomeScreen;