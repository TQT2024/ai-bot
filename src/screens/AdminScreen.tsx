import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useAuthStore } from '../store/authStore';
import { auth } from '../../firebaseconfig';
import { seedCoursesToPosts } from '../store/postStore';

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminScreen'> &
  DrawerNavigationProp<RootStackParamList>;

const AdminScreen = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      logout();
    } catch (error) {
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất');
    }
  };
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
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingTop: 86,
    justifyContent: 'space-between', // đảm bảo các phần tử được phân chia đều, nút đăng xuất hiển thị ở dưới cùng
  },
  Section: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  card: {
    width: '40%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AdminScreen;
