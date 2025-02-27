import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminScreen'> &
    DrawerNavigationProp<RootStackParamList>;

const AdminScreen = () => {
    const navigation = useNavigation<AdminScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <View style={styles.Section}>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#0171C6' }]}
                    onPress={() => navigation.navigate('ManageUsers')}
                >
                    <Icon name="address-card" size={30} color="#fff" />
                    <Text style={styles.cardText}>User</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.card, { backgroundColor: '#0171C6' }]}
                    onPress={() => navigation.navigate('ManagePost')}
                >
                    <Icon name="book" size={30} color="#fff" />
                    <Text style={styles.cardText}>Post</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
        top: 86
    },
    Section: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#f2f2f2',
        paddingVertical: 20,
      },
    card: {
        width: '40%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        top: 20,
    },
    cardText: {
        color: '#fff',
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default AdminScreen;
