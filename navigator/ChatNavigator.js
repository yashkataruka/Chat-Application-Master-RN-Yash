import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';

import Colors from '../constants/Colors';
import ChatsScreen from '../screens/ChatScreen/ChatsScreen';
import GroupsScreen from '../screens/ChatScreen/GroupsScreen';
import NearbyScreen from '../screens/ChatScreen/NearbyScreen';
import ActiveScreen from '../screens/ChatScreen/ActiveScreen';
import ChatDetailScreen from '../screens/ChatScreen/ChatDetailScreen';

const homeScreenConfig = {
    Chats: {
        screen: ChatsScreen
    },
    Groups: {
        screen: GroupsScreen
    },
    Nearby: {
        screen: NearbyScreen
    },
    Active: {
        screen: ActiveScreen
    }
}

const HomeNavigator = createMaterialTopTabNavigator(homeScreenConfig, {
    tabBarOptions: {
        upperCaseLabel: false,
        indicatorStyle: {
            backgroundColor: 'white'
        },
        labelStyle: {
            fontWeight: 'bold',
            fontSize: 18
        },
        style: {
            backgroundColor: Colors.primary,
            elevation: 0
        }
    }
})

const ChatNavigator = createStackNavigator({
    Chats: {
        screen: HomeNavigator,
        navigationOptions: {
            headerTintColor: 'white',
            headerTitleAlign: 'center',
            headerTitle: 'Home',
            headerStyle: {
                elevation: 0,
                backgroundColor: Colors.primary
            },
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
})

export default createAppContainer(ChatNavigator)