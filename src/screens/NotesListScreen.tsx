import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNoteStore } from '../store/noteStore';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  NotesListScreen: undefined;
  AddNoteScreen: undefined;
  NoteDetailScreen: { noteId: string };
};

type NotesListScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'NotesListScreen'>;

const NotesListScreen: React.FC = () => {
  const notes = useNoteStore((state) => state.notes);
  const loadNotes = useNoteStore((state) => state.loadNotes);
  const navigation = useNavigation<NotesListScreenNavigationProp>();

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);
  

  return (
    <View style={styles.container}>
      <View style={styles.header} >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notes</Text>
      </View>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={ () => navigation.navigate('NoteDetailScreen', { noteId: item.id }) }
          >
            <View style={styles.noteItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.content}>{item.content}</Text>
              <Text style={styles.notes}>{item.notes}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },
  noteItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    fontSize: 16,
    color: '#666',
  },
  notes: {
    fontSize: 14,
    color: '#999',
  },
});

export default NotesListScreen;
