import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

type RouteParams = {
  category: string;
};

const FAQDetail: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params as RouteParams;

  const faqData: Record<string, { question: string; answer: string }[]> = {
    account: [
      { question: 'Làm thế nào để đăng ký tài khoản?', answer: 'Bạn có thể đăng ký bằng cách điền thông tin...' },
      { question: 'Quên mật khẩu thì làm sao?', answer: 'Vui lòng nhấn vào mục "Quên mật khẩu" để lấy lại mật khẩu.' },
    ],
    chatbot: [
      { question: 'Chatbot hoạt động như thế nào?', answer: 'Chatbot sử dụng AI để trả lời các câu hỏi của bạn.' },
      { question: 'Làm sao để cải thiện trải nghiệm với Chatbot?', answer: 'Hãy cung cấp phản hồi để cải thiện Chatbot.' },
    ],
    features: [
      { question: 'Ứng dụng có những tính năng gì?', answer: 'Ứng dụng hỗ trợ quản lý ghi chú, lịch, chat và nhiều hơn nữa.' },
      { question: 'Cách sử dụng tính năng tìm kiếm?', answer: 'Bạn có thể sử dụng thanh tìm kiếm ở đầu màn hình.' },
    ],
  };

  const data = faqData[category] || [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#000" />
          <Text style={styles.backText}>Quay lại</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ - {category}</Text>
      </View>

      {data.map((item, index) => (
        <View key={index} style={styles.faqItem}>
            <TouchableOpacity>
                <Text style={styles.question}>{item.question}</Text>
                <Text style={styles.answer}>{item.answer}</Text>
            </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
    marginTop: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    marginLeft: 5,
    fontSize: 16,
    color: '#000',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  faqItem: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  answer: {
    marginTop: 5,
    fontSize: 14,
    color: '#555',
  },
});

export default FAQDetail;
