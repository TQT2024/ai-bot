import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuthStore } from '../store/authStore';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddScreen from '../screens/AddScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import SidebarMenu from '../components/SidebarMenu';
import BottomMenuBar from '../components/BottomMenuBar';
import AddNoteDrawer from '../components/AddNoteDrawer';
import AddCalendarDrawer from '../components/AddCalendarDrawer';
import NotesListScreen from '../screens/NotesListScreen';
import NoteDetailScreen from '../screens/NoteDetailScreen';
import CalendarScreen from '../screens/CalendarScreen';
import CourseDetailScreen from '../screens/CourseDetailScreen';
import DangKy from '../screens/SignUpScreen';
import DangNhap from '../screens/LogInScreen';
import AdminScreen from '../screens/AdminScreen';
import ManageUsers from '../screens/ManageUser';
import ManagePost from '../screens/ManagePost';
import PostDetailScreen from '../screens/PostDetailScreen';
import QuenMatKhau from '../screens/ForgotPasswordScreen';
import ContactScreen from '../screens/ContactScreen';
import FAQDetail from '../components/FAQitem';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
export type RootStackParamList = {

  HomeStack: {
    screen: 'Home' | 'Settings' | 'Add' | 'Notifications' | 'Profile' | 'ChatScreen' |
     'AddNoteDrawer' | 'AddCalendarDrawer' | 'NotesListScreen' | 'CourseDetailScreen' | 'ContactScreen' | 'FAQDetail';
  };
  NoteStack: {
    screen: 'NotesListScreen' | 'NoteDetailScreen';
  };
  AuthStack: {
    screen: 'DangNhap' | 'DangKy' | 'AdminScreen' | 'QuenMatKhau';
  }
  AdminStack: {
    screen: 'AdminScreen' | 'ManageUsers' | 'ManagePost' | 'PostDetailScreen';
  }

  Home: undefined;
  Settings: undefined;
  Add: undefined;
  Notifications: undefined;
  Profile: undefined;
  ChatScreen: undefined;
  AddNoteDrawer: undefined;
  AddCalendarDrawer: undefined;
  NotesListScreen: undefined;
  NoteDetailScreen: { noteId: string };
  CourseDetailScreen: { title: string; url: string };
  DangNhap: undefined;
  DangKy: undefined;
  QuenMatKhau: undefined;
  AdminScreen: undefined;
  ManageUsers: undefined;
  ManagePost: undefined;
  PostDetailScreen: { postId: string };
  ContactScreen: undefined;
  FAQDetail: { category: string; question: string; answer: string };
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
      <Stack.Screen name="Settings" component={SettingsScreen} 
        options={{ headerShown: false}}
      />
      <Stack.Screen name="Add" component={AddScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} 
        options={{headerShown: false}}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} 
        options={{headerShown: false}} 
      />
      <Stack.Screen 
        name="ChatScreen"
        component={ChatScreen}
        options={{
          
          headerShown: false,
       }}
      />
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
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ContactScreen"
        component={ContactScreen}
        options={{
          title: 'Contact',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="FAQDetail"
        component={FAQDetail}
        options={{
          title: 'FAQ Detail',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
    <BottomMenuBar />
  </>
);

const AuthStack = () => (
  <Stack.Navigator >
    <Stack.Screen 
      name="DangNhap" 
      component={DangNhap} 
      options={{ headerShown: false }} 
    />
    <Stack.Screen 
      name="DangKy" 
      component={DangKy} 
      options={{ headerShown: false }} />
    <Stack.Screen
      name="AdminScreen"
      component={AdminScreen}
      options={{ headerShown: false, title: 'Admin' }}
    />
    <Stack.Screen
      name="QuenMatKhau"
      component={QuenMatKhau}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
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

const AdminStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerTitleAlign: 'center',
    }}
    initialRouteName="AdminScreen"
  >
    <Stack.Screen
      name="AdminScreen"
      component={AdminScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ManageUser"
      component={ManageUsers}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ManagePost"
      component={ManagePost}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="PostDetailScreen"
      component={PostDetailScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isLoggedIn, role } = useAuthStore();

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        role === 'admin' ? (
          <Drawer.Navigator
            drawerContent={(props) => <SidebarMenu {...props} />}
            screenOptions={{
              headerShown: false,
              drawerType: 'slide',
              overlayColor: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <Drawer.Screen name="AdminScreen" component={AdminScreen} />
            <Drawer.Screen name="ManageUsers" component={ManageUsers} />
            <Drawer.Screen name="ManagePost" component={ManagePost} />
            <Drawer.Screen name="PostDetailScreen" component={PostDetailScreen} />
          </Drawer.Navigator>
        ) : (
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
            <Drawer.Screen name="AuthStack" component={AuthStack} />
            <Drawer.Screen name="AdminStack" component={AdminStack} />
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
        )
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
