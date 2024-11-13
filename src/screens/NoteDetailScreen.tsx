import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useNoteStore } from '../store/noteStore';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const NoteDetailScreen: React.FC<DrawerContentComponentProps> = (props) => {
  const route = useRoute();
  const navigation = useNavigation();
  const { noteId } = route.params as { noteId: string };
  const notes = useNoteStore((state) => state.notes);
  const updateNote = useNoteStore((state) => state.updateNote);
  
  const note = notes.find((n) => n.id === noteId);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSave = () => {
    if (note) {
      updateNote({
        ...note,
        title,
        content,
      });
      setIsEditing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.navigate('NoteStack', {screen: 'NotesListScreen'})} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
           {isEditing ? (
            <Text onPress={handleSave}>Save</Text>   
        ) : (
           <Text>Edit</Text>
        ) } 
        </TouchableOpacity>
      </View>

      {isEditing ? (
        <>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
          />
          <TextInput
            style={styles.input}
            value={content}
            onChangeText={setContent}
            placeholder="Content"
            multiline
          />
        </>
      ) : (
        <>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.content}>{content}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
    
  },
  editButton: {
    padding: 10,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    fontSize: 18,
    marginTop: 10,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 20,
    fontSize: 18,
  },
});

export default NoteDetailScreen;
