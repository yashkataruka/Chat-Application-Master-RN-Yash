import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CampusScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <Text>Campus Screen</Text>
        </View>
    );
}

CampusScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTitle: 'Campus',
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

export default CampusScreen;