import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const AddScreen = () => {
  const navigation = useNavigation();
  const [messages, setMessages] = useState([
    { id: '1', text: 'Welcome! How can I help you?', sender: 'bot' },
  ]);
  const [message, setMessage] = useState('');

  // Hàm gửi tin nhắn
  const sendMessage = () => {
    if (message.trim() === '') return;

    // Thêm tin nhắn của người dùng vào danh sách
    const userMessage = { id: Date.now().toString(), text: message, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Xóa nội dung ô nhập tin nhắn
    setMessage('');

    // Bot phản hồi tự động
    setTimeout(() => {
      const botMessage = {
        id: Date.now().toString(),
        text: 'This is a bot reply!',
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      {/* Khung trò chuyện */}
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userText : styles.botText,
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          contentContainerStyle={styles.chatContent}
        />
      </View>

      {/* Khung nhập tin nhắn */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Icon name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9EEF3',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  backText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    paddingBottom: 80,
    paddingHorizontal: 10,
    marginTop: 70,
  },
  chatContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  message: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#3F51B5',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  messageText: {
    fontSize: 16,
  },
  userText: {
    color: '#fff',
  },
  botText: {
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 120,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#000066',
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AddScreen;
