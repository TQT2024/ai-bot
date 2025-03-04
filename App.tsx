// App.tsx
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import { useNoteStore } from './src/store/noteStore';
import * as Notifications from 'expo-notifications';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const loadNotes = useNoteStore((state) => state.loadNotes);

  useEffect(() => {
    async function loadFont() {
      await Font.loadAsync({
        FontAwesome: require('react-native-vector-icons/Fonts/FontAwesome.ttf'),
      });
      setFontLoaded(true);
    }
    loadFont();
    loadNotes();
    Notifications.requestPermissionsAsync();
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
