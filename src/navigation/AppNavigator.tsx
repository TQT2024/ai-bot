import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddScreen from '../screens/AddScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SidebarMenu from '../components/SidebarMenu';
import BottomMenuBar from '../components/BottomMenuBar';
import AddNoteDrawer from '../components/AddNoteDrawer';
import AddCalendarDrawer from '../components/AddCalendarDrawer';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export type RootStackParamList = {
  HomeStack: {
    screen: 'Home' | 'Settings' | 'Add' | 'Notifications' | 'Profile' |
     'AddNoteDrawer' | 'AddCalendarDrawer' | 'NotesListScreen' | 'CourseDetailScreen';
  };
  NoteStack: {
    screen: 'NotesListScreen' | 'NoteDetailScreen';
  };
  Home: undefined;
  Settings: undefined;
  Add: undefined;
  Notifications: undefined;
  Profile: undefined;
  AddNoteDrawer: undefined;
  AddCalendarDrawer: undefined;
  NotesListScreen: undefined;
  NoteDetailScreen: { noteId: string };
  CourseDetailScreen: { title: string; url: string };

};

const HomeStack = () => (
  <>
    <Stack.Navigator
      screenOptions={{
        headerLeft: null,
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Add" component={AddScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="AddNoteDrawer"
        component={AddNoteDrawer}
        options={{
          title: 'Add Note',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="AddCalendarDrawer"
        component={AddCalendarDrawer}
        options={{
          title: 'Add Calendar',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="CourseDetailScreen"
        component={CourseDetailScreen}
        options={{
          title: 'News Detail',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
    <BottomMenuBar />
  </>
);

const NotesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleAlign: 'center',
    }}
    initialRouteName="NotesListScreen"
  >
    <Stack.Screen
      name="NotesListScreen"
      component={NotesListScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="NoteDetailScreen"
      component={NoteDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <SidebarMenu {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'slide',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <Drawer.Screen name="HomeStack" component={HomeStack} />
        <Drawer.Screen name="NoteStack" component={NotesStack} />
        <Stack.Screen name="NotesListScreen" component={NotesListScreen} options={{ headerShown: false }} />
        <Stack.Screen
        name="NoteDetailScreen"
        component={NoteDetailScreen}
        options={{ 
          headerShown: false,
        }}
        />
        <Stack.Screen name="Calendar" component={CalendarScreen} options={{ headerShown: true }}/>
        <Stack.Screen name="AddScreen" component={AddScreen} options={{ headerShown: true }}/>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
