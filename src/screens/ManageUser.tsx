import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserStore, User } from '../store/storeUser';

const ManageUsers = () => {
  const { users, addUser, updateUser, deleteUser } = useUserStore();
  const navigation = useNavigation();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddUser = () => {
    if (name && email && password) {
      addUser({ name, email, password });
      resetForm();
      setModalVisible(false);
    } else {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin');
    }
  };

  const handleUpdateUser = () => {
    if (editingUserId) {
      updateUser(editingUserId, { name, email, password });
      resetForm();
      setModalVisible(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xoá user này không?',
      [
        { text: 'Không', style: 'cancel' },
        { text: 'Có', onPress: () => deleteUser(id) },
      ],
      { cancelable: true }
    );
  };

  const resetForm = () => {
    setEditingUserId(null);
    setName('');
    setEmail('');
    setPassword('');
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userText}>{item.name}</Text>
        <Text style={styles.userText}>{item.email}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(item)}>
          <Text style={styles.buttonText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
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
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
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
              {editingUserId ? 'Cập nhật User' : 'Thêm User'}
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
            {editingUserId ? (
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
