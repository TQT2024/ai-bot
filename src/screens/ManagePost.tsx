import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePostStore, Post } from '../store/postStore';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminScreen'> &
    DrawerNavigationProp<RootStackParamList>;

const ManagePost = () => {
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const { posts, addPost } = usePostStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUri, setImageUri] = useState('');
  const [icon, setIcon] = useState('');

  const handleAddCourse = () => {
    if (title && url && imageUri && icon) {
      addPost({ title, url, imageUri, icon });
      // Reset form
      setTitle('');
      setUrl('');
      setImageUri('');
      setIcon('');
      setModalVisible(false);
    } else {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
    }
  };

  const renderItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() =>
        navigation.navigate('PostDetailScreen', { postId: item.id })
      }
    >
      <Image source={{ uri: item.imageUri }} style={styles.courseImage} />
      <Text style={styles.courseTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}> Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Quản lý Post</Text>
        </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Chưa có course nào</Text>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity
        style={styles.plusButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.plusButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thêm Post</Text>
            <TextInput
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TextInput
              placeholder="URL"
              value={url}
              onChangeText={setUrl}
              style={styles.input}
            />
            <TextInput
              placeholder="Image URI"
              value={imageUri}
              onChangeText={setImageUri}
              style={styles.input}
            />
            <TextInput
              placeholder="Icon"
              value={icon}
              onChangeText={setIcon}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleAddCourse}>
              <Text style={styles.buttonText}>Thêm Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Huỷ</Text>
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
    padding: 16,
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
  courseCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 3,
    alignItems: 'center',
    flexDirection: 'row',
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  courseTitle: {
    padding: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ManagePost;
