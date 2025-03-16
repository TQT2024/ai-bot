import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadUserSettings, saveUserSettings, UserSettings } from '../../firebase/userSettings';
import { useAuthStore } from '../store/authStore';

type ThemeContextType = {
  backgroundColor: string;
  setBackgroundColor: (color: string) => Promise<void>;
};

export const ThemeContext = createContext<ThemeContextType>({
  backgroundColor: '#ffffff',
  setBackgroundColor: async () => {},
});

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [backgroundColor, setBackgroundColorState] = useState('#ffffff');
  const { isLoggedIn, userId } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        if (isLoggedIn && userId) {
          // Load setting data từ fb store
          const settings = await loadUserSettings(userId);
          if (settings && settings.backgroundColor) {
            setBackgroundColorState(settings.backgroundColor);
            await AsyncStorage.setItem('backgroundColor', settings.backgroundColor);
          } else {
            // Nếu không có data trong fb store => Load từ AsyncStorage
            const savedColor = await AsyncStorage.getItem('backgroundColor');
            if (savedColor) {
              setBackgroundColorState(savedColor);
            }
          }
        } else {
          // Chưa login => load từ local
          const savedColor = await AsyncStorage.getItem('backgroundColor');
          if (savedColor) {
            setBackgroundColorState(savedColor);
          }
        }
      } catch (error) {
        console.error('Lỗi load background color:', error);
      }
    })();
  }, [isLoggedIn, userId]);

  const setBackgroundColor = async (color: string) => {
    try {
      setBackgroundColorState(color);
      await AsyncStorage.setItem('backgroundColor', color);
      if (isLoggedIn && userId) {
        await saveUserSettings(userId, { backgroundColor: color });
      }
    } catch (error) {
      console.error('Lỗi save background color:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor }}>
      {children}
    </ThemeContext.Provider>
  );
};
