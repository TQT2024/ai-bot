import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../navigation/AppNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import * as MailComposer from 'expo-mail-composer';
import { ThemeContext } from '../context/ThemeContext';

type ChatScreenProps = StackScreenProps<RootStackParamList, 'ChatScreen'>;

const ChatScreen = ({ navigation }: ChatScreenProps) => {
  const [message, setMessage] = useState('');
  const { backgroundColor } = useContext(ThemeContext);

  const sendEmail = async () => {
    if (!message.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung phản hồi.');
      return;
    }

    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: ['hophuoc4so9@gmail.com'],
        subject: 'Phản hồi từ ứng dụng',
        body: message,
      });
      Alert.alert('Thành công', 'Phản hồi của bạn đã được gửi.');
      setMessage('');
    } else {
      Alert.alert('Lỗi', 'Thiết bị không hỗ trợ gửi email.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor}]}>
      <View style={styles.header}>
        <Text style={styles.username}>Trường đại học Thủ Dầu Một</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>Liên hệ</Text>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Thông tin liên hệ:</Text>
          <Text style={styles.infoText}>Email: chatbottdmu@gmail.com</Text>
          <Text style={styles.infoText}>SDT: 09999999</Text>
        </View>

        <Text style={styles.label}>Phản hồi:</Text>
        <TextInput
          style={styles.textbox}
          placeholder="Nhập phản hồi của bạn..."
          multiline
          value={message}
          onChangeText={setMessage}
        />

        <TouchableOpacity style={styles.button} onPress={sendEmail}>
          <Text style={styles.buttonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#f2f2f2',
  },
  header: {
    padding: 20,
    marginTop: 60,
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
    padding: 15,
    // backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 18,
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    margin: 10
  },
  textbox: {
    height: 100,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    fontSize: 16,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
