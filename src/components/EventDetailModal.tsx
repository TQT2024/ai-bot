import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Modal, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { CalendarEvent } from '../types/calendar';
import useCalendarStore from '../store/calendarStore';

interface EventDetailModalProps {
  visible: boolean;
  event: CalendarEvent | null;
  onClose: () => void;
}

const formatDateTime = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
};

const EventDetailModal: React.FC<EventDetailModalProps> = ({ visible, event, onClose }) => {
  const { updateEvent, deleteEvent } = useCalendarStore();
  const [editedEvent, setEditedEvent] = useState<CalendarEvent | null>(event);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (event) {
      setEditedEvent(event);
    }
  }, [event]);

  const handleInputChange = (key: keyof CalendarEvent, value: string | boolean) => {
    if (editedEvent) {
      setEditedEvent({ ...editedEvent, [key]: value });
    }
  };

  const handleDateChange = (key: 'startDate' | 'endDate', date: Date | undefined) => {
    if (date && editedEvent) {
      setEditedEvent({ ...editedEvent, [key]: date.toISOString() });
    }
  };

  const handleSave = async () => {
    if (editedEvent) {
      await updateEvent(editedEvent);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (editedEvent) {
      await deleteEvent(editedEvent.id);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.title}>Event Details</Text>

            {editedEvent && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Title"
                  value={editedEvent.title}
                  onChangeText={(text) => handleInputChange('title', text)}
                />

                <Text style={styles.label}>Start Date</Text>
                <Text
                  style={styles.dateText}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  {formatDateTime(editedEvent.startDate)}
                </Text>
                {showStartDatePicker && (
                  <DateTimePickerModal
                    isVisible={showStartDatePicker}
                    date={new Date(editedEvent.startDate)}
                    mode="datetime"
                    display="default"
                    onConfirm={(selectedDate) => {
                      setShowStartDatePicker(false);
                      handleDateChange('startDate', selectedDate || new Date(editedEvent.startDate));
                    }}
                    onCancel={() => setShowStartDatePicker(false)}
                  />
                )}

                <Text style={styles.label}>End Date</Text>
                <Text
                  style={styles.dateText}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  {formatDateTime(editedEvent.endDate)}
                </Text>
                {showEndDatePicker && (
                  <DateTimePickerModal
                    isVisible={showEndDatePicker}
                    date={new Date(editedEvent.endDate)}
                    mode="datetime"
                    display="default"
                    onConfirm={(selectedDate) => {
                      setShowEndDatePicker(false);
                      handleDateChange('endDate', selectedDate || new Date(editedEvent.endDate));
                    }}
                    onCancel={() => setShowEndDatePicker(false)}
                  />
                )}

                <View style={styles.switchContainer}>
                  <Text>All Day Event</Text>
                  <Switch
                    value={editedEvent.isAllDay}
                    onValueChange={(value) => handleInputChange('isAllDay', value)}
                  />
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Location"
                  value={editedEvent.location || ''}
                  onChangeText={(text) => handleInputChange('location', text)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editedEvent.description || ''}
                  onChangeText={(text) => handleInputChange('description', text)}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveButton}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleDelete}>
                    <Text style={styles.deleteButton}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>Close</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  saveButton: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#555',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EventDetailModal;
