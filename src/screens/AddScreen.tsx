import React, { useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { RootStackParamList } from '../types/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNoteStore } from '../store/noteStore';
import useCalendarStore from '../store/calendarStore';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { auth } from '../../firebaseconfig';
import { ThemeContext } from '../context/ThemeContext';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddScreen'> & 
  DrawerNavigationProp<RootStackParamList>;

const AddScreen = () => {
  const navigation = useNavigation<AddScreenNavigationProp>();
  const notes = useNoteStore((state) => state.notes);
  const events = useCalendarStore((state) => state.events);
  const clearNotes = useNoteStore((state) => state.clearNotes);
  const clearEvents = useCalendarStore((state) => state.clearEvents);
  const { backgroundColor } = useContext(ThemeContext);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={styles.menuButton}
        >
          <Icon name="bars" size={24} color="#000" />
        </TouchableOpacity>
      ),
      headerTitle: 'Add',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useEffect(() => {
    clearNotes();
    clearEvents();
  }, []);

  const combinedData = [
    ...notes.map((note) => ({ type: 'note', title: `Note added: ${note.title}`, id: note.id, createdTime: note.timestamp })),
    ...events.map((event) => ({ type: 'event', title: `Event added: ${event.title}`, id: event.id, createdTime: event.timestamp })),
  ]
  .sort((a, b) => b.createdTime - a.createdTime)
  .slice(0, 10);

  const createTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const difference = now - timestamp;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.topSection}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#0171C6' }]}
          onPress={() => navigation.navigate('AddNoteDrawer', { note: undefined })}
        >
          <Icon name="sticky-note" size={30} color="#fff" />
          <Text style={styles.cardText}>Add Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#0171C6' }]}
          onPress={() => navigation.navigate('AddCalendarDrawer')}
        >
          <Icon name="calendar" size={30} color="#fff" />
          <Text style={styles.cardText}>Add Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.modalTitle}></Text>
        <FlatList
          data={combinedData}
          keyExtractor={(item,index) => item.id || index.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={styles.noteTitle}>{item.title}</Text>
                  <Text>{createTimeAgo(item.createdTime)}</Text>
                </View>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topSection: {
    flex: 1,
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
    top: 20,
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  noteItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  noteTitle: {
    fontSize: 16,
  },
  menuButton: {
    paddingLeft: 15,
  },
});

export default AddScreen;