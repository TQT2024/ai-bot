import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useCalendarStore from '../store/calendarStore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';

const AddCalendarDrawer: React.FC = () => {
  const addEvent = useCalendarStore((state) => state.addEvent);
  const navigation = useNavigation();

  const [eventData, setEventData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    isAllDay: false,
    location: '',
    description: '',
    notification: '30 minutes before',
    type: 'event' as 'event' | 'class' | 'reminder',
    color: '#4285f4',
    timestamp: Date.now(),
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [eventType, setEventType] = useState<'event' | 'class' | 'reminder'>('event');

  const handleSave = async () => {
    if (!eventData.title || !eventData.startDate) {
      Alert.alert('Error', 'Please enter a title and start time for the event');
      return;
    }

    Alert.alert('Success', 'Event created successfully');
    navigation.goBack();

    try {
      await addEvent(eventData);
    } catch (error) {
      console.error("Save error:", error);
      Alert.alert('Error', 'Failed to save event');
    }
  };

  const handleDateChange = (type: 'start' | 'end', date: Date) => {
    setEventData((prev) => ({
      ...prev,
      [`${type}Date`]: date.toISOString(),
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={navigation.goBack} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="#5f6368" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add {eventType}</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.typeSelector}>
        {(['event', 'class', 'reminder'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              eventType === type && styles.selectedTypeButton,
            ]}
            onPress={() => {
              setEventType(type);
              setEventData((prev) => ({ ...prev, type }));
            }}
          >
            <Text
              style={[
                styles.typeButtonText,
                eventType === type && styles.selectedTypeButtonText,
              ]}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.formContainer}>
        <TextInput
          style={styles.titleInput}
          placeholder="Add title"
          value={eventData.title}
          onChangeText={(title) => setEventData((prev) => ({ ...prev, title }))}
          placeholderTextColor="#5f6368"
        />

        <View style={styles.dateTimeContainer}>
          <View style={styles.allDayRow}>
            <Text style={styles.label}>All-day</Text>
            <Switch
              value={eventData.isAllDay}
              onValueChange={(isAllDay) =>
                setEventData((prev) => ({ ...prev, isAllDay }))
              }
              trackColor={{ false: '#767577', true: '#4285f4' }}
            />
          </View>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.dateTimeTextContainer}>
              <MaterialIcons name="access-time" size={20} color="#5f6368" />
              <Text style={styles.dateTimeText}>
                {eventData.startDate
                  ? new Date(eventData.startDate).toLocaleString()
                  : 'Start time'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeRow}>
            <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.dateTimeTextContainer}>
              <MaterialIcons name="access-time" size={20} color="#5f6368" />
              <Text style={styles.dateTimeText}>
                {eventData.endDate
                  ? new Date(eventData.endDate).toLocaleString()
                  : 'End time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DateTimePickerModal
          isVisible={showStartPicker}
          mode="datetime"
          onConfirm={(date) => {
            handleDateChange('start', date);
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />

        <DateTimePickerModal
          isVisible={showEndPicker}
          mode="datetime"
          onConfirm={(date) => {
            handleDateChange('end', date);
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />

        <View style={styles.inputRow}>
          <MaterialIcons name="location-on" size={20} color="#5f6368" />
          <TextInput
            style={styles.input}
            placeholder="Add location"
            value={eventData.location}
            onChangeText={(location) =>
              setEventData((prev) => ({ ...prev, location }))
            }
            placeholderTextColor="#5f6368"
          />
        </View>

        <View style={styles.inputRow}>
          <MaterialIcons name="description" size={20} color="#5f6368" />
          <TextInput
            style={styles.input}
            placeholder="Add description"
            value={eventData.description}
            onChangeText={(description) =>
              setEventData((prev) => ({ ...prev, description }))
            }
            multiline
            placeholderTextColor="#5f6368"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#202124',
  },
  closeButton: {
    padding: 8,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    color: '#4285f4',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    marginBottom: 24,
    color: '#202124',
  },
  dateTimeContainer: {
    marginBottom: 24,
  },
  label: {
    color: '#202124',
  },
  allDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dateTimeTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    marginLeft: 16,
    color: '#202124',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginLeft: 16,
    color: '#202124',
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f1f3f4',
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
  },
  selectedTypeButton: {
    backgroundColor: '#4285f4',
  },
  typeButtonText: {
    color: '#5f6368',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
});

export default AddCalendarDrawer;
