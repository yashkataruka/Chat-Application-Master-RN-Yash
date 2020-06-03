import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const NearbyScreen = props => {
    return (
        <View style = {styles.coontainer} >
            <Text>Nearby Screen</Text>
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

export default NearbyScreen;