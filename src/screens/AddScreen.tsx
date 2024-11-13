import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../store/types';
import { StackNavigationProp } from '@react-navigation/stack';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddScreen'>;

const AddScreen = () => {
  const navigation = useNavigation<AddScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate({ name: 'AddNoteDrawer', params: { note: undefined } })}
        >
          <Icon name="sticky-note" size={30} color="#fff" />
          <Text style={styles.cardText}>Thêm Ghi Chú</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FF6347' }]}
          onPress={() => navigation.navigate({ name: 'AddCalendarDrawer', params: undefined })}
        >
          <Icon name="calendar" size={30} color="#fff" />
          <Text style={styles.cardText}>Thêm Sự Kiện</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  card: {
    width: '40%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default AddScreen;
