import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useChatStore } from '../store/chatStore';

const ChatScreen = () => {
  const navigation = useNavigation();
  const { messages, sendUserMessage, clearChat, isLoading, fetchMessages } = useChatStore();
  const [message, setMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchMessages().then(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    });
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '') return;
    await sendUserMessage(message);
    setMessage('');
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const handleClearChat = () => {
    clearChat();
  };

  // Hàm render tin nhắn với xử lý link
  const renderMessageItem = ({ item }: { item: any }) => {
    if (item.sender === 'chatbot' && item.text.includes("Tài liệu liên quan:")) {
      const parts = item.text.split("\n\nTài liệu liên quan:");
      const mainText = parts[0];
      const linkText = parts[1].trim();
      return (
        <View style={[styles.message, styles.botMessage]}>
          <Text style={[styles.messageText, styles.botText]}>{mainText}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(linkText)}>
            <Text style={styles.linkText}>Xem tài liệu liên quan</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
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
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#000" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearChat}>
        <Icon name="trash" size={20} color="#000" />
        <Text style={styles.clearText}>Xóa chat</Text>
      </TouchableOpacity>

      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.chatContent}
        />
      </View>

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
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Icon name="send" size={20} color="#fff" />
          )}
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
  },
  backText: {
    marginLeft: 10,
    color: '#000',
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  clearText: {
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
  linkText: {
    color: '#0000EE',
    textDecorationLine: 'underline',
    marginTop: 5,
    fontSize: 14,
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

export default ChatScreen;

