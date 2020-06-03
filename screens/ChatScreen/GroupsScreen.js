import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GroupsScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <Text>Groups Screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    coontainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default GroupsScreen;