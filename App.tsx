import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator, BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Font from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddScreen from './src/screens/AddScreen';
import NotificationsScreen from './src/screens/NotificationScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();

function CustomTabBarButton({ children, onPress }: BottomTabBarButtonProps & { children: React.ReactNode }) {
  return (
    <TouchableOpacity
      style={[styles.customButton, styles.shadow]}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
  }, []);

  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            position: 'absolute',
            bottom: 5,
            left: 5,
            right: 5,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            height: 70,
          },
        }}
      >
        <Tab.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Icon name="home" color={"#000077"} size={27} />,
          }}
        />
        <Tab.Screen
          name="SettingsScreen"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="cog" color={"#000077"} size={27} />,
          }}
        />
        <Tab.Screen
          name="AddScreen"
          component={AddScreen}
          options={{
            tabBarIcon: () => <Icon name="plus" color="#fff" size={27} />,
            tabBarButton: (props) => (
              <CustomTabBarButton {...props}>
                <Icon name="plus" color="#fff" size={25} />
              </CustomTabBarButton>
            ),
          }}
        />
        <Tab.Screen
          name="NotificationsScreen"
          component={NotificationsScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="lightbulb-o" color={"#000077"} size={27} />,
          }}
        />
        <Tab.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ color }) => <Icon name="user" color={"#000077"} size={27} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    bottom: 20,
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
