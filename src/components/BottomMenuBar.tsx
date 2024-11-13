// BottomMenuBar.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/AppNavigator';

type HomeStackNavigationProp = DrawerNavigationProp<RootStackParamList, 'HomeStack'>;

const BottomMenuBar = () => {
  const navigation = useNavigation<HomeStackNavigationProp>();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Home' })} style={styles.iconContainer}>
        <Icon name="home" color="#000077" size={27} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Settings' })} style={styles.iconContainer}>
        <Icon name="cog" color="#000077" size={27} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Add' })} style={[styles.iconContainer, styles.addButton]}>
        <Icon name="plus" color="#fff" size={27} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Notifications' })} style={styles.iconContainer}>
        <Icon name="lightbulb-o" color="#000077" size={27} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeStack', { screen: 'Profile' })} style={styles.iconContainer}>
        <Icon name="user" color="#000077" size={27} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 70,
    backgroundColor: '#ffffff',
    borderRadius: 15,
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    bottom: 20,
  },
});

export default BottomMenuBar;
