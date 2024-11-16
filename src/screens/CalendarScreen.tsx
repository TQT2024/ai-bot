import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import useCalendarStore from '../store/calendarStore';
import { CalendarEvent } from '../types/calendar';
import EventDetailModal from '../components/EventDetailModal';

const HOUR_HEIGHT = 60;
const TIME_LABEL_WIDTH = 50;
const DAY_HEADER_HEIGHT = 50;
const COLUMN_WIDTH = (Dimensions.get('window').width - TIME_LABEL_WIDTH) / 7;

const EVENT_COLORS = {
  event: '#FF9800',
  class: '#2196F3',
};

const { width, height } = Dimensions.get('window');


const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { events, getEventsByDateRange } = useCalendarStore();
  const [visibleEvents, setVisibleEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log('All events from store:', events);
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    console.log('Fetching events between:', {
        start: startOfWeek.toISOString(),
        end: endOfWeek.toISOString()
      });

    const weekEvents = getEventsByDateRange(startOfWeek, endOfWeek);
    setVisibleEvents(weekEvents);

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, [currentDate, events]);

  const calculateRedLinePosition = () => {
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    return hours * HOUR_HEIGHT + (minutes / 60) * HOUR_HEIGHT + DAY_HEADER_HEIGHT;
  };
  

  const generateTimeSlots = () => {
    return Array.from({ length: 24 }, (_, i) => 
      `${i.toString().padStart(2, '0')}:00`
    );
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getEventColor = (event: CalendarEvent) => {
    return event.color || EVENT_COLORS[event.type];
  };

  const getEventsForDateAndTime = (date: Date, hour: number) => {
    return visibleEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      
      if (event.isAllDay) {
        return eventStart.getDate() === date.getDate() &&
               eventStart.getMonth() === date.getMonth() &&
               eventStart.getFullYear() === date.getFullYear();
      }

      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear() &&
        eventStart.getHours() === hour
      );
    });
  };

  const formatEventTime = (date: string) => {
    return new Date(date).toLocaleTimeString('default', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderTimeLabels = () => (
    <View style={styles.timeLabelsContainer}>
      <View style={styles.headerSpacer} />
      {generateTimeSlots().map((time) => (
        <View key={time} style={styles.timeLabel}>
          <Text style={styles.timeLabelText}>{time}</Text>
        </View>
      ))}
    </View>
  );

  const renderEvent = (event: CalendarEvent) => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const durationHours = (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60 * 60);
    
    return (
      <TouchableOpacity
        key={event.id}
        style={[
          styles.event,
          {
            backgroundColor: getEventColor(event),
            height: event.isAllDay ? HOUR_HEIGHT : Math.max(HOUR_HEIGHT * durationHours, HOUR_HEIGHT - 2),
          }
        ]}
        onPress={() => {
          handleEventPress(event);
          console.log('Event pressed:', event);
        }}
      >
        <Text style={styles.eventTime}>
          {event.isAllDay ? 'All Day' : formatEventTime(event.startDate)}
        </Text>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {event.title}
        </Text>
        {event.location && (
          <Text style={styles.eventLocation} numberOfLines={1}>
            📍 {event.location}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderDayColumn = (dayOffset: number) => {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - currentDate.getDay() + dayOffset);

    return (
      <View style={styles.dayColumn} key={dayOffset}>
        <View style={[
          styles.dayHeader,
          isToday(date) && styles.todayHeader
        ]}>
          <Text style={styles.dayHeaderTextDay}>
            {date.toLocaleString('default', { weekday: 'short' })}
          </Text>
          <Text style={[
            styles.dayHeaderTextDate,
            isToday(date) && styles.todayText
          ]}>
            {date.getDate()}
          </Text>
        </View>
        {generateTimeSlots().map((_, hour) => (
          <View key={hour} style={styles.timeSlot}>
            {getEventsForDateAndTime(date, hour).map(event => renderEvent(event))}
          </View>
        ))}
      </View>
    );
  };

  const handleEventPress = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  // Close modal and reset selected event
  const closeModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 7);
            setCurrentDate(newDate);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity
          onPress={() => {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 7);
            setCurrentDate(newDate);
          }}
          style={styles.headerButton}
        >
          <Text style={styles.headerButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Grid */}
      <ScrollView horizontal style={styles.scrollViewHorizontal}>
        <ScrollView style={styles.scrollViewVertical}>
          <View style={styles.gridContainer}>
            {renderTimeLabels()}
            <View style={styles.daysContainer}>
              {Array.from({ length: 7 }, (_, i) => renderDayColumn(i))}
            </View>
            <View
              style={{
                position: 'absolute',
                top: calculateRedLinePosition(),
                left: TIME_LABEL_WIDTH - 45,
                right: 0,
                height: 2,
                backgroundColor: 'red',
                zIndex: 10,
              }}
            />
            <View
              style={{
                position: 'absolute',
                top: calculateRedLinePosition() - 5 ,
                left: TIME_LABEL_WIDTH -45,
                backgroundColor: 'red',
                paddingHorizontal: width * 0.03,
                borderRadius: 10,
                zIndex: 10,
              }}
            >
              <Text style={{ color: 'white', fontSize: 10 }}>
                {currentTime.toLocaleTimeString('default', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        </ScrollView>
      </ScrollView>
      <EventDetailModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={closeModal}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  headerButtonText: {
    fontSize: 18,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollViewHorizontal: {
    flex: 1,
  },
  scrollViewVertical: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
  },
  timeLabelsContainer: {
    width: TIME_LABEL_WIDTH,
    backgroundColor: 'white',
  },
  headerSpacer: {
    height: DAY_HEADER_HEIGHT,
  },
  timeLabel: {
    height: HOUR_HEIGHT,
    justifyContent: 'center',
    paddingRight: 8,
  },
  timeLabelText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
  },
  daysContainer: {
    flexDirection: 'row',
  },
  dayColumn: {
    width: COLUMN_WIDTH,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
  },
  dayHeader: {
    height: DAY_HEADER_HEIGHT,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  todayHeader: {
    backgroundColor: '#eff6ff',
  },
  dayHeaderTextDay: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
  },
  dayHeaderTextDate: {
    fontSize: 20,
    color: '#111827',
  },
  todayText: {
    color: '#2563eb',
  },
  timeSlot: {
    height: HOUR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 1,
  },
  event: {
    position: 'absolute',
    left: 2,
    right: 2,
    borderRadius: 4,
    padding: 4,
    justifyContent: 'center',
  },
  eventTime: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
  eventTitle: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 10,
    color: 'white',
    marginTop: 2,
  },
});

export default CalendarScreen;