import React from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import {  useSelector} from 'react-redux';

import EnterNumberScreen from '../screens/Auth/EnterNumberScreen';
import EnterCodeScreen from '../screens/Auth/EnterCodeScreen';
import ConnectSociallyScreen from '../screens/Auth/ConnectSociallyScreen';
import Colors from '../constants/Colors';
import HomeScreen from '../screens/ChatScreen/HomeScreen';
import StoriesScreen from '../screens/ChatScreen/StoriesScreen';
import PostScreen from '../screens/ChatScreen/PostScreen';
import CampusScreen from '../screens/ChatScreen/CampusScreen';
import MiscScreen from '../screens/ChatScreen/MiscScreen';
import ChatDetailScreen from '../screens/ChatScreen/ChatDetailScreen';
import ChatsScreen from '../screens/ChatScreen/ChatsScreen';
import ChatNavigator from './ChatNavigator';
import CameraScreen from '../screens/ChatScreen/CameraScreen';
import ImagePreviewScreen from '../screens/ChatScreen/ImagePreviewScreen';
import UserDetailScreen from '../screens/ChatScreen/UserDetailScreen';
import VideoScreen from '../screens/ChatScreen/VideoScreen';
import AudioScreen from '../screens/ChatScreen/AudioScreen';
import ForwardScreen from '../screens/ChatScreen/ForwardScreen';

const NumberLoginNavigator = createStackNavigator({
    EnterNumber: {
        screen: EnterNumberScreen,
        navigationOptions: {
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: Colors.primary
            }
        }
    },
    ConnectSocially: {
        screen: ConnectSociallyScreen,
        navigationOptions: {
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: Colors.primary
            }
        }
    }
})

const EnterCodeNavigator = createStackNavigator({
    EnterCode: {
        screen: EnterCodeScreen,
        navigationOptions: {
            headerTitleAlign: 'center',
            headerTintColor: 'white',
            headerStyle: {
                backgroundColor: Colors.primary
            }
        }
    }
})

// const HomeScreenNavigator = createStackNavigator({
//     HomeScreen: {
//         screen: HomeScreen,
//         navigationOptions: {
//             headerShown: false
//         }
//     }
// })

const StoriesNavigator = createStackNavigator({
    Stories: {
        screen: StoriesScreen
    }
})

const PostNavigator = createStackNavigator({
    Post: {
        screen: PostScreen
    }
})

const CampusNavigator = createStackNavigator({
    Campus: {
        screen: CampusScreen
    }
})

const MiscNavigator = createStackNavigator({
    Misc: {
        screen: MiscScreen
    }
})

const tabScreenConfig = {
    Home: {
        // screen: HomeScreenNavigator,
        screen: ChatNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name = 'ios-chatbubbles' size = {35} color = {tabInfo.tintColor}/>
            },
            tabBarColor: 'white',
            tabBarLabel: 'Home'
        }
    },
    Stories: {
        screen: StoriesNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <View style = {{justifyContent: 'center', alignItems: 'center'}} >
                        {!tabInfo.focused ? 
                        <View>
                            <Ionicons name = 'md-heart-empty' size = {35} color = {tabInfo.tintColor}/>
                            {/* <Image style = {styles.story} /> */}
                        </View>
                        :
                        <Ionicons name = "md-heart" size = {35} color = {Colors.primary}/>
                        }
                    </View>
                )
            },
            tabBarColor: 'white',
            tabBarLabel: 'Stories'
        }
    },
    Post: {
        screen: PostNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return (
                    <View style = {{justifyContent: 'center', alignItems: 'center'}} >
                        <ImageBackground style = {styles.post}>
                            <MaterialCommunityIcons name = 'pencil' size = {35} color = "white"/>
                        </ImageBackground>
                    </View>
                )
            },
            tabBarColor: 'white',
            tabBarLabel: 'Post'
        }
    },
    Campus: {
        screen: CampusNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <FontAwesome name = 'graduation-cap' size = {30} color = {tabInfo.tintColor}/>
            },
            tabBarColor: 'white',
            tabBarLabel: 'Campus'
        }
    },
    Misc: {
        screen: MiscNavigator,
        navigationOptions: {
            tabBarIcon: (tabInfo) => {
                return <Ionicons name = 'ios-menu' size = {35} color = {tabInfo.tintColor}/>
            },
            tabBarColor: 'white',
            tabBarLabel: 'Misc'
        }
    }
}

const BottomTabNavigator = createBottomTabNavigator(tabScreenConfig, {
    tabBarOptions: {
        activeTintColor: Colors.primary,
        inactiveTintColor: '#8C9CB0',
        labelPosition: "below-icon",
        labelStyle: {
            bottom: 2
        },
        style: {
            borderTopColor: 'transparent',
            elevation: 0
        },
    }
})

const CameraSwitchNavigator = createSwitchNavigator({
    Camera: {
        screen: CameraScreen
    },
    Image: {
        screen: ImagePreviewScreen
    }
})

const MainNavigator = createStackNavigator({
    Tab: {
        screen: BottomTabNavigator,
        navigationOptions: {
            headerShown: false
        }
    },
    ChatDetail: {
        screen: ChatDetailScreen
    },
    Forward: {
        screen: ForwardScreen
    },
    UserDetail: {
        screen: UserDetailScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Camera: {
        screen: CameraSwitchNavigator,
        navigationOptions: {
            headerShown: false
        }
    },
    VideoScreen: {
        screen: VideoScreen,
        navigationOptions: {
            headerShown: false
        }
    },
    Audio: {
        screen: AudioScreen
    }
})

const styles = StyleSheet.create({
    post: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 15
    }
})

const AuthNavigator = createSwitchNavigator({
    // NumberLogin: {
    //     screen: NumberLoginNavigator
    // },
    // EnterCode: {
    //     screen: EnterCodeNavigator
    // },
    Main: {
        screen: MainNavigator
    }
})

export default createAppContainer(AuthNavigator)