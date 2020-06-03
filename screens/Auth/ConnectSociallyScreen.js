import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const ConnectSociallyScreen = props => {
    return (
        <View style = {styles.container} >
            <View style = {styles.card} >
                <View style = {{margin: 20}} >
                    <Text style = {{fontWeight: 'bold', fontSize: 20, textAlign: 'center'}} >
                        Login with Social Accounts
                    </Text>
                </View>
                <View style = {styles.accounts} >
                    <TouchableOpacity>
                        <View style = {{height: 50, width: 50, borderRadius: 25, backgroundColor: '#D44638',
                            justifyContent: 'center', alignItems: 'center'}}>
                            <MaterialCommunityIcons name = "gmail" size = {27} color ="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style = {{height: 50, width: 50, borderRadius: 25, backgroundColor: '#3B5998',
                            justifyContent: 'center', alignItems: 'center'}}>
                            <Ionicons name = "logo-facebook" size = {27} color ="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style = {{height: 50, width: 50, borderRadius: 25, backgroundColor: '#0072C6',
                            justifyContent: 'center', alignItems: 'center'}}>
                            <MaterialCommunityIcons name = "outlook" size = {27} color ="white" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style = {{height: 50, width: 50, borderRadius: 25, backgroundColor: '#7CBB00',
                            justifyContent: 'center', alignItems: 'center'}}>
                            <MaterialCommunityIcons name = "microsoft" size = {27} color ="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

ConnectSociallyScreen.navigationOptions = navData => {
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
    accounts: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    }
})

export default ConnectSociallyScreen;