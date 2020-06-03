import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions, PixelRatio } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

var FONT_SIZE = 15;

if (PixelRatio.get() >= 3) {
    FONT_SIZE = 20
}

const EnterNumberScreen = props => {
    return (
        <View style = {styles.container} >
            <View style = {styles.card} >
                <View style = {{marginTop: '5%', marginLeft: '8%', marginBottom: 20, height: 20}} >
                    <Text style = {{fontWeight: 'bold', fontSize: FONT_SIZE, textAlign: 'left'}} >
                        Enter your Mobile Number to Login or Register
                    </Text>
                </View>
                <View style = {styles.number} >
                    <View style = {{borderColor: '#ccc', borderWidth: 1, padding: 10, height: 50, justifyContent: 'center'}} >
                        <Text style = {{fontSize: 18}} >+91</Text>
                    </View>
                    <View  style = {styles.textInput}  >
                        <TextInput keyboardType = "number-pad" key maxLength = {10}  style = {{fontSize: 18}} />
                    </View>
                </View>
                <View style = {{height: 50, width: 50, borderRadius: 25, backgroundColor: Colors.primary,
                        left: Dimensions.get("window").width / 1.37, justifyContent: 'center', alignItems: 'center' }} >
                    <TouchableOpacity onPress = {() => props.navigation.navigate("EnterCode")} >
                        <Ionicons name = "md-arrow-forward" size = {27} color = "white" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{flex: 1, justifyContent: 'flex-end', marginBottom: 30}} >
                <View style = {{flexDirection: 'row', alignItems: 'flex-end', marginRight: 10}} >
                    <TouchableOpacity onPress = {() => props.navigation.navigate("ConnectSocially")} >
                        <View style = {styles.connectSocially} >
                            <Text style = {{color: 'white', marginHorizontal: 10, marginVertical: 5, fontSize: FONT_SIZE}}>Connect Socially</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {{marginLeft: 45, marginTop: 20, flexDirection: 'row'}} >
                    <View style = {{width: 50, height: 5, backgroundColor: 'black', borderRadius: 3, marginRight: 10}} />
                    <View style = {{width: 50, height: 5, backgroundColor: 'white', borderRadius: 3, borderWidth: 1, borderColor: 'black'}} />
                </View>
            </View>
        </View>
    )
}

EnterNumberScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Campus Ring'
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: '100%',
        width: '100%'
    },
    card: {
        margin: '10%',
        height: Dimensions.get("window").height / 4.5,
        width: '80%',
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10
    },
    number: {
        width: '85%',
        marginLeft: 25,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    textInput: {
        marginLeft: 20,
        width: '70%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        height: 50,
        fontSize: 18,
        paddingLeft: 15,
        justifyContent: 'center'
    },
    connectSocially: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: Colors.primary,
        marginLeft: 40
    }
})

export default EnterNumberScreen;