import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../context/ThemeContext';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'HomeStack'>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const { backgroundColor, setBackgroundColor } = useContext(ThemeContext);

  // Khi component mount, check AsyncStorage và update state
  useEffect(() => {
    (async () => {
      try {
        const savedState = await AsyncStorage.getItem('notificationEnabled');
        if (savedState !== null) {
          setIsNotificationEnabled(JSON.parse(savedState));
        } else {
          const { status } = await Notifications.getPermissionsAsync();
          setIsNotificationEnabled(status === 'granted');
        }
      } catch (error) {
        console.error('Lỗi đọc trạng thái thông báo:', error);
      }
    })();
  }, []);

  const toggleNotificationSwitch = async (value: boolean) => {
    setIsNotificationEnabled(value);
    try {
      await AsyncStorage.setItem('notificationEnabled', JSON.stringify(value));
    } catch (error) {
      console.error('Lỗi lưu trạng thái thông báo:', error);
    }
    
    if (value) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        Alert.alert('Quyền thông báo', 'Bạn chưa cấp quyền thông báo.');
        setIsNotificationEnabled(false);
        await AsyncStorage.setItem('notificationEnabled', JSON.stringify(false));
      }
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
      Alert.alert('Thông báo', 'Ứng dụng sẽ không hiển thị thông báo.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor}]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={25} color="#000" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      {/* Hiển thị thông báo */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Cho phép hiển thị thông báo</Text>
        <Switch
          onValueChange={toggleNotificationSwitch}
          value={isNotificationEnabled}
        />
      </View>

      {/* Các mục cài đặt khác */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Thay đổi màu nền</Text>
        <View style={styles.colorOptions}>
          <TouchableOpacity onPress={() => setBackgroundColor('#f8f9fa')}>
            <View style={[styles.colorBox, { backgroundColor: '#f8f9fa' }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBackgroundColor('#d1c4e9')}>
            <View style={[styles.colorBox, { backgroundColor: '#d1c4e9' }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBackgroundColor('#b3e5fc')}>
            <View style={[styles.colorBox, { backgroundColor: '#b3e5fc' }]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setBackgroundColor('#ffe0b2')}>
            <View style={[styles.colorBox, { backgroundColor: '#ffe0b2' }]} />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.settingText}>Tài khoản</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate('ContactScreen')}>
        <Text style={styles.settingText}>Liên hệ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Chia sẻ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 25,
  },
  backText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  settingText: {
    fontSize: 18,
  },
  colorOptions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
});

export default SettingsScreen;
