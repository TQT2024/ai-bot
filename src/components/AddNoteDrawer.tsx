// AddNoteScreen.tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useNoteStore } from '../store/noteStore';
import { useNavigation } from '@react-navigation/native';

const AddNoteDrawer: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const addNote = useNoteStore((state) => state.addNote);
  const navigation = useNavigation();

  const handleSave = () => {
    addNote({
      id: Math.random().toString(),
      title,
      content,
      notes,
    });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.titleInput}
        placeholder="Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Content"
        placeholderTextColor="#aaa"
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TextInput
        style={styles.notesInput}
        placeholder="Notes"
        placeholderTextColor="#aaa"
        multiline
        value={notes}
        onChangeText={setNotes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  contentInput: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    flex: 1,
    textAlignVertical: 'top', // Để nội dung bắt đầu từ trên cùng khi multiline
  },
  notesInput: {
    fontSize: 16,
    color: '#000',
    marginTop: 10,
    textAlignVertical: 'top', // Để nội dung bắt đầu từ trên cùng khi multiline
  },
});

export default AddNoteDrawer;
