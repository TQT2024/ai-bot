// App.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as Font from 'expo-font';
import { useNoteStore } from './src/store/noteStore';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';
import { auth } from './firebaseconfig';
import { useAuthStore } from './src/store/authStore';
import { useChatStore } from './src/store/chatStore';
import useCalendarStore from './src/store/calendarStore';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const loadNotes = useNoteStore((state) => state.loadNotes);
  const { logout }= useAuthStore();
  const {isLoggedIn}=useAuthStore();
  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
    Notifications.requestPermissionsAsync();
  }, []);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user && isLoggedIn) {
        logout()
        Alert.alert('Phiên hết hạn', 'Phiên đã hết hạn. Xin hãy đăng nhập lại lần nữa.');
      }
      if(user)
      {
        useChatStore.getState().fetchMessages();
        loadNotes();

      }
    });
    return unsubscribe;
  }, []);
  if (!fontLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
}
