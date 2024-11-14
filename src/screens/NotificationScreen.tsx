// screens/Home.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../types/types';
import { StackScreenProps } from '@react-navigation/stack';

type NotificationsScreenProps = StackScreenProps<RootStackParamList, 'NotificationsScreen'>;

const NotificationScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>Trường đại học Thủ Dầu Một</Text>
      </View>
      
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  username: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 10,
  },
  card: {
    width: '48%',
    padding: 20,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    marginTop: 10,
    fontWeight: 'bold',
  },
  promotionContainer: {
    padding: 20,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  promotionCard: {
    backgroundColor: '#FFB74D',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  promotionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footerCard: {
    backgroundColor: '#3F51B5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  customButtonContainer: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6347',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

export default NotificationScreen;
