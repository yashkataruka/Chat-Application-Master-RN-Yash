import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoriesScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <Text>Stories Screen</Text>
        </View>
    );
}

StoriesScreen.navigationOptions = navData => {
    return {
        headerStyle: {
            backgroundColor: Colors.primary,
            elevation: 0
        },
        headerTitle: 'Stories',
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

export default StoriesScreen;