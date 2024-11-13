import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../store/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNoteStore } from '../store/noteStore';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddScreen'>;

const AddScreen = () => {
  const navigation = useNavigation<AddScreenNavigationProp>();
  const notes = useNoteStore((state) => state.notes);

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate({ name: 'AddNoteDrawer', params: { note: undefined } })}
        >
          <Icon name="sticky-note" size={30} color="#fff" />
          <Text style={styles.cardText}>Add Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FF6347' }]}
          onPress={() => navigation.navigate({ name: 'AddCalendarDrawer', params: undefined })}
        >
          <Icon name="calendar" size={30} color="#fff" />
          <Text style={styles.cardText}>Add Calendar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <Text style={styles.modalTitle}></Text>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text style={styles.noteTitle}>Note added: {item.title}</Text>
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
    backgroundColor: '#f2f2f2',
  },
  topSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    
    backgroundColor: '#f2f2f2',
    paddingVertical: 20,
  },
  card: {
    width: '40%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    top: 20
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
});

export default AddScreen;
