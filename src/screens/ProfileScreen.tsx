// screens/ProfileScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { auth } from '../../firebaseconfig';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../types/types';
import { useAuthStore } from '../store/authStore';

type ProfileScreenProps = StackScreenProps<RootStackParamList, 'ProfileScreen'>;

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const {logout }= useAuthStore();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        {currentUser ? (
          <View style={styles.profileInfo}>
            {/* Hiển thị ảnh đại diện nếu có, ngược lại hiển thị placeholder */}
            {currentUser.photoURL ? (
              <Image source={{ uri: currentUser.photoURL }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.placeholderAvatar]}>
                <Text style={styles.avatarText}>{currentUser.email?.[0].toUpperCase()}</Text>
              </View>
            )}
            <Text style={styles.infoText}>Email: {currentUser.email}</Text>
            <Text style={styles.infoText}>
              Tên: {currentUser.displayName ? currentUser.displayName : 'Chưa cập nhật'}
            </Text>
            <Text style={styles.infoText}>
              Số điện thoại: {currentUser.phoneNumber ? currentUser.phoneNumber : 'Chưa cập nhật'}
            </Text>
          </View>
        ) : (
          <Text style={styles.infoText}>Người dùng chưa đăng nhập</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => { logout(); handleLogout(); }}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  profileInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginVertical: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  placeholderAvatar: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    color: '#fff',
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
