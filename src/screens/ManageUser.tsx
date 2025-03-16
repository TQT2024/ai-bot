import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../../firebaseconfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {
  loadUsersFromFirebase,
  addUserToFirebase,
  updateUserInFirebase,
  deleteUserFromFirebase,
  FirebaseUser,
} from '../store/firebaseService';

const ManageUsers = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState<FirebaseUser[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<FirebaseUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      const loadedUsers = await loadUsersFromFirebase();
      setUsers(loadedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const resetForm = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleAddUser = async () => {
    if (name && email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await addUserToFirebase({ name, email, password, isAdmin: false });
        resetForm();
        setModalVisible(false);
        loadUsers();
        Alert.alert('Thông báo', 'Thêm user thành công');
      } catch (error) {
        console.error("Error adding user:", error);
        Alert.alert('Lỗi', 'Không thể thêm user');
      }
    } else {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      try {
        await updateUserInFirebase(editingUser.id!, { name, email, password, isAdmin: false });
        resetForm();
        setModalVisible(false);
        loadUsers();
      } catch (error) {
        console.error("Error updating user:", error);
        Alert.alert('Lỗi', 'Không thể cập nhật user');
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xoá user này không?',
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Có', onPress: async () => {
            try {
              await deleteUserFromFirebase(userId);
              loadUsers();
            } catch (error) {
              console.error("Error deleting user:", error);
              Alert.alert('Lỗi', 'Không thể xoá user');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditUser = (user: FirebaseUser) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: FirebaseUser }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{item.name}</Text>
        <Text style={styles.userText}>{item.email}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditUser(item)}>
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteUser(item.id!)}>
          <Text style={styles.buttonText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}> Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý User</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id!}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có user nào</Text>}
      />

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => {
          resetForm();
          setModalVisible(true);
        }}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingUser ? 'Cập nhật User' : 'Thêm User'}
            </Text>
            <TextInput
              placeholder="Tên"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
            />
            {editingUser ? (
              <TouchableOpacity style={styles.button} onPress={handleUpdateUser}>
                <Text style={styles.buttonText}>Cập nhật User</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleAddUser}>
                <Text style={styles.buttonText}>Thêm User</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  backButton: {
    padding: 8,
    marginLeft: -12,
  },
  backButtonText: {
    color: '#0066cc',
    fontSize: 18,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 10,
  },
  userInfo: {
    flex: 1,
  },
  userText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  editButton: {
    backgroundColor: 'green',
    padding: 6,
    borderRadius: 4,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 6,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0066cc',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  plusButtonText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 10,
    borderRadius: 4,
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 8,
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
  },
});

export default ManageUsers;
