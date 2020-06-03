import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PixelRatio } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

var FONT_SIZE = 15;

if (PixelRatio.get() >= 3) {
    FONT_SIZE = 20
}

const EnterCodeScreen = props => {
    return (
        <View style = {styles.container} >
            <View style = {styles.card} >
                <View style = {{margin: 20, height: 30}} >
                    <Text style = {{fontWeight: 'bold', fontSize: FONT_SIZE}} >
                        Waiting to automatically detect and send SMS to +91-9600644453
                    </Text>
                </View>
                <View style = {styles.code} >
                    <View style = {{flexDirection: 'row', alignItems: 'center'}} >
                        <TextInput style = {styles.textInput} keyboardType = "number-pad" maxLength = {1} />
                        <TextInput style = {styles.textInput} keyboardType = "number-pad" maxLength = {1} />
                        <TextInput style = {styles.textInput} keyboardType = "number-pad" maxLength = {1} />
                        <TextInput style = {styles.textInput} keyboardType = "number-pad" maxLength = {1} />
                    </View>
                </View>
                <View style = {{height: 50, width: 50, backgroundColor: Colors.primary, justifyContent: 'center', 
                    alignItems: 'center', borderRadius: 25, left: '90%', top: '20%'}} >
                    <TouchableOpacity onPress = {() => props.navigation.navigate("Main")} >
                        <Ionicons name = "md-arrow-forward" color = "white" size = {27} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style = {{flex: 1, justifyContent: 'flex-end', marginBottom: 30}}>
                <Text style = {{fontSize: FONT_SIZE, fontWeight: 'bold', marginLeft: 40, marginBottom: 20}} >Didn't receive the code?</Text>
                <View style = {{flexDirection: 'row', marginRight: 10}} >
                    <TouchableOpacity onPress = {() => console.log("Working?")} >
                        <View style = {styles.connectSocially} >
                            <Text style = {{color: 'white', marginHorizontal: 10, marginVertical: 5, fontSize: FONT_SIZE}}>Resend code</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => props.navigation.navigate("NumberLogin")} >
                        <View style = {styles.connectSocially1} >
                            <Text style = {{color: 'white', marginHorizontal: 10, marginVertical: 5, fontSize: FONT_SIZE}}>Change mobile number</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style = {{marginLeft: 45, marginTop: 30, flexDirection: 'row'}} >
                    <View style = {{width: 50, height: 5, backgroundColor: 'white', borderRadius: 3, marginRight: 10, borderWidth: 1, borderColor: 'black'}} />
                    <View style = {{width: 50, height: 5, backgroundColor: 'black', borderRadius: 3, marginRight: 10}} />
                </View>
            </View>
        </View>
    )
}

EnterCodeScreen.navigationOptions = navData => {
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
        height: 180,
        width: '80%',
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 10
    },
    code: {
        paddingLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    textInput: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        width: 40,
        marginRight: 10,
        fontSize: 30,
        textAlign: 'center',
        padding: 5
    },
    connectSocially: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: Colors.primary,
        marginLeft: 40
    },
    connectSocially1: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: Colors.primary,
        marginLeft: 10
    }
})

export default EnterCodeScreen;