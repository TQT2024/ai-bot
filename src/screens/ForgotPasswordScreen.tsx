import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { auth } from '../../firebaseconfig';
import { sendPasswordResetEmail } from 'firebase/auth';

type AuthStackNavigationProp = DrawerNavigationProp<RootStackParamList, 'AuthStack'>;

const QuenMatKhau = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const [email, setEmail] = React.useState('');

  const handleResetPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Thành công', 'Đã gửi mail đặt lại mật khẩu');
      navigation.navigate('DangNhap');
    } catch (error) {
      const errorMessage = error.message;
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên mật khẩu</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gửi email đặt lại mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('DangNhap')}>
        <Text style={styles.linkText}>Quay lại đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#000066",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    alignItems: "center",
  },
  linkText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});

export default QuenMatKhau;