import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import useCalendarStore from '../store/calendarStore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const REMINDER_INTERVALS = [
  { label: '1 day before', minutes: 24 * 60 },
  { label: '6 hours before', minutes: 6 * 60 },
  { label: '1 hour before', minutes: 60 },
  { label: '30 minutes before', minutes: 30 },
  { label: '15 minutes before', minutes: 15 },
  { label: '5 minutes before', minutes: 5 },
];


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
    type: 'event' as 'event' | 'class',
    color: '#4285f4',
    timestamp: Date.now(),
    reminders: [24 * 60, 60, 15, 5],
    notificationIds: [] as string[],
  });

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [eventType, setEventType] = useState<'event' | 'class'>('event');
  const [showReminderModal, setShowReminderModal] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Error', 'Failed to get push token for push notification!');
        return;
      }
    } 
  };

  const scheduleNotification = async (notificationTime: Date) => {
    try {
      const trigger = new Date(notificationTime);
      trigger.setSeconds(0);
      
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: eventData.title,
          body: `${eventData.type} starting in ${trigger < new Date(eventData.startDate) ? 
            `${Math.round((new Date(eventData.startDate).getTime() - trigger.getTime()) / (1000 * 60))} minutes` : 
            'now'}`,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          vibrate: [0, 250, 250, 250],
        },
        trigger,
      });
      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!eventData.title || !eventData.startDate) {
      Alert.alert('Error', 'Please enter a title and start time for the event');
      return;
    }

    try {
      // Cancel any existing notifications for this event
      if (eventData.notificationIds.length > 0) {
        await Promise.all(
          eventData.notificationIds.map(id => Notifications.cancelScheduledNotificationAsync(id))
        );
      }

      // Schedule new notifications for each reminder interval
      const notificationIds = [];
      const startTime = new Date(eventData.startDate).getTime();

      for (const minutes of eventData.reminders) {
        const notificationTime = new Date(startTime - minutes * 60 * 1000);
        const now = new Date();

        // Only schedule if the notification time is in the future
        if (notificationTime > now) {
          const notificationId = await scheduleNotification(notificationTime);
          if (notificationId) {
            notificationIds.push(notificationId);
          }
        }
      }

      // Update event data with notification IDs
      const updatedEventData = {
        ...eventData,
        notificationIds,
      };

      await addEvent(updatedEventData);
      Alert.alert('Success', 'Event created successfully');
      navigation.goBack();
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

  const toggleReminder = (minutes: number) => {
    setEventData((prev) => ({
      ...prev,
      reminders: prev.reminders.includes(minutes)
        ? prev.reminders.filter(r => r !== minutes)
        : [...prev.reminders, minutes].sort((a, b) => b - a)
    }));
  };

  const ReminderModal = () => (
    <Modal
      visible={showReminderModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowReminderModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Reminders</Text>
          {REMINDER_INTERVALS.map(({ label, minutes }) => (
            <TouchableOpacity
              key={minutes}
              style={styles.reminderItem}
              onPress={() => toggleReminder(minutes)}
            >
              <Text style={styles.reminderLabel}>{label}</Text>
              {eventData.reminders.includes(minutes) && (
                <MaterialIcons name="check" size={24} color="#4285f4" />
              )}
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowReminderModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
        {(['event', 'class'] as const).map((type) => (
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

        {/* <TouchableOpacity
          style={[styles.bellButton, eventData.reminders.length > 0 && styles.bellButtonActive]}
          onPress={() => setShowReminderModal(true)}
        >
          <MaterialIcons
            name={eventData.reminders.length > 0 ? "notifications-active" : "notifications-none"}
            size={24}
            color={eventData.reminders.length > 0 ? "#4285f4" : "#5f6368"}
          />
        </TouchableOpacity>
        <ReminderModal /> */}
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  reminderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reminderLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4285f4',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bellButton: {
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  bellButtonActive: {
    backgroundColor: '#e8f0fe',
  },
  
});

export default AddCalendarDrawer;
