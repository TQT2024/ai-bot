import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { usePostStore, Post } from '../store/postStore';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type AdminScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AdminScreen'> &
  DrawerNavigationProp<RootStackParamList>;

type RouteParams = {
  postId: string;
};

const PostDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<AdminScreenNavigationProp>();
  const { postId } = route.params as RouteParams;
  const { posts, updatePost, deletePost } = usePostStore();
  const post = posts.find((c) => c.id === postId);

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post?.title || '');
  const [url, setUrl] = useState(post?.url || '');
  const [imageUri, setImageUri] = useState(post?.imageUri || '');
  const [icon, setIcon] = useState(post?.icon || '');

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setUrl(post.url);
      setImageUri(post.imageUri);
      setIcon(post.icon);
    }
  }, [post]);

  if (!post) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không tìm thấy post.</Text>
      </View>
    );
  }

  const handleUpdate = () => {
    updatePost(postId, { title, url, imageUri, icon });
    setEditing(false);
    Alert.alert('Thông báo', 'Cập nhật post thành công.');
  };

  const handleDelete = () => {
    Alert.alert(
      'Xác nhận xoá',
      'Bạn có chắc chắn muốn xoá post này không?',
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: () => {
            deletePost(postId);
            navigation.navigate('ManagePost');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ManagePost')}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Detail</Text>
      </View>

      <Image source={{ uri: imageUri }} style={styles.postImage} />

      {editing ? (
        <View style={styles.editContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Nhập title"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>URL</Text>
            <TextInput
              style={styles.input}
              value={url}
              onChangeText={setUrl}
              placeholder="Nhập URL"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Image URI</Text>
            <TextInput
              style={styles.input}
              value={imageUri}
              onChangeText={setImageUri}
              placeholder="Nhập Image URI"
            />
          </View>
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Icon</Text>
            <TextInput
              style={styles.input}
              value={icon}
              onChangeText={setIcon}
              placeholder="Nhập Icon"
            />
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Lưu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditing(false)}
            >
              <Text style={styles.buttonText}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.detailContainer}>
          <View style={styles.detailField}>
            <Text style={styles.fieldLabel}>Title:</Text>
            <Text style={styles.fieldValue}>{title}</Text>
          </View>
          <View style={styles.detailField}>
            <Text style={styles.fieldLabel}>URL:</Text>
            <Text style={styles.fieldValue}>{url}</Text>
          </View>
          <View style={styles.detailField}>
            <Text style={styles.fieldLabel}>Image URI:</Text>
            <Text style={styles.fieldValue}>{imageUri}</Text>
          </View>
          <View style={styles.detailField}>
            <Text style={styles.fieldLabel}>Icon:</Text>
            <Text style={styles.fieldValue}>{icon}</Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setEditing(true)}
            >
              <Text style={styles.buttonText}>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Xoá</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: '#fff',
    paddingBottom: 32,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 40,
  },
  backButton: {
    padding: 8,
    marginLeft: -12,
  },
  backButtonText: {
    color: '#0066cc',
    fontSize: 18,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  detailField: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  fieldLabel: {
    fontWeight: 'bold',
    width: 100,
    color: '#333',
  },
  fieldValue: {
    flex: 1,
    color: '#555',
  },
  editContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#000066',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    fontSize: 16,
  },
});

export default PostDetailScreen;
