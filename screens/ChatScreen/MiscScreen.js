import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MiscScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <Text>Misc Screen</Text>
        </View>
    );
}

MiscScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTitle: 'Misc',
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

export default MiscScreen;