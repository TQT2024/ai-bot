import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigation/AppNavigator';

type ContactScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'HomeStack'>;

const ContactScreen: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const navigation = useNavigation<ContactScreenNavigationProp>();

  const handleSendFeedback = () => {
    if (feedback.trim().length === 0) {
      Alert.alert('Lỗi', 'Vui lòng nhập phản hồi của bạn.');
      return;
    }
    Alert.alert('Phản hồi', 'Phản hồi của bạn đã được gửi. Cảm ơn bạn!');
    setFeedback('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Thông tin liên hệ</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Email :</Text>
        <Text style={styles.value}>admin@example.com</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Số điện thoại:</Text>
        <Text style={styles.value}>+84 123 456 789</Text>
      </View>

      <Text style={styles.subHeader}>Các thắc mắc thường gặp</Text>

      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => navigation.navigate('FAQDetail', { category: 'account', question: '', answer: '' })}
      >
        <Text style={styles.faqTitle}>Về tài khoản</Text>
        <Text style={styles.faqContent}>Xem các câu hỏi thường gặp liên quan đến tài khoản...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => navigation.navigate('FAQDetail', { category: 'chatbot', question: '', answer: '' })}
      >
        <Text style={styles.faqTitle}>Về Chatbot</Text>
        <Text style={styles.faqContent}>Xem các câu hỏi thường gặp về Chatbot...</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.faqItem}
        onPress={() => navigation.navigate('FAQDetail', { category: 'features', question: '', answer: '' })}
      >
        <Text style={styles.faqTitle}>Về các tính năng của ứng dụng</Text>
        <Text style={styles.faqContent}>Xem các câu hỏi thường gặp về các tính năng...</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Phản hồi</Text>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Nhập phản hồi của bạn..."
        value={feedback}
        onChangeText={setFeedback}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Gửi phản hồi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
    textAlign: 'center',
  },
  infoBox: {
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
  },
  faqItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  faqTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  faqContent: {
    fontSize: 14,
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000066',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ContactScreen;
