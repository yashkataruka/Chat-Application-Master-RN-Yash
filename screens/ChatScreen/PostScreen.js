import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, Alert } from 'react-native';

const PostScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <View>
                <Button title = "doevn" onPress = {() => {
                    console.log("Alert")
                    Alert.alert("Don't lie!", "You know that this is wrong...", [{text: "Sorry", style: "cancel"}]);
                }} />
            </View>
        </View>
    );
}

PostScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTitle: 'Post',
        headerTitleAlign: 'center',
        headerTintColor: 'white'
    }
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default PostScreen;