import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type AuthStackNavigationProp = DrawerNavigationProp<RootStackParamList, 'AuthStack'>;

const DangNhap = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login: () => void = useAuthStore((state: { login: () => void }) => state.login);

  const handleLogin = () => {
    if (email === 'test@gmail.com' && password === '123') {
      login();
    } else {
      alert('Thông tin đăng nhập không chính xác');
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('DangKy');
  };
  

  return (
    <View style={styles.container}>
    <Text style={styles.title}>Đăng nhập</Text>
    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <TextInput
      style={styles.input}
      placeholder="Mật khẩu"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={true}
    />

    <TouchableOpacity style={styles.button} onPress={handleLogin} >
      <Text style={styles.buttonText}>Đăng nhập</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.googleButton} >
      <Icon name="google" size={18} color="#CC0000" />
      <Text style={styles.buttonText2}> Đăng nhập bằng Google/  </Text>
      <Icon name="facebook" size={18} color="#4267B2" />
      <Text style={styles.buttonText3}> Đăng nhập bằng Facebook</Text>
    </TouchableOpacity>

    <View style={styles.linkContainer}>

      <TouchableOpacity onPress={handleNavigateToRegister}>
        <Text style={styles.linkText}>Đăng ký tài khoản</Text>
      </TouchableOpacity>
    </View>
    
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#003366",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#000066",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    alignItems: "center",
    textAlign: 'center',
  },
  buttonText2: {
    color: "#333",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: 'center',
    alignItems: "center",
  },
  buttonText3: {
    color: "#4267B2",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: 'center',
  },
  linkContainer: {
    alignItems: "center",
    marginBottom: 0,
  },
  linkText: {
    color: "#0066cc",
    fontSize: 15,
    marginTop: 5,
  },
  googleButton: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#DB4437",
  },
  facebookButton: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 11,
    borderRadius: 10,
    alignItems: "center",
  },
});

export default DangNhap;
