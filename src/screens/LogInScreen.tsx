import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { RootStackParamList } from '../navigation/AppNavigator';
import { app } from '../../firebaseconfig';
import { checkAdminPrivileges } from '../store/firebaseServiec';

type AuthStackNavigationProp = DrawerNavigationProp<RootStackParamList, 'AuthStack'>;

const DangNhap = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkAdminPrivileges(user.uid);
        if (isAdmin === true) {
          login('admin', user.uid);
        } else {
          login('user', user.uid);
        }
      }
    });

    return () => unsubscribe();
  }, [login]);

  const handleLogin = async () => {
    const studentEmailRegex = /^[0-9]+@student\.tdmu\.edu\.vn$/;
    const adminEmailRegex = /^[a-zA-Z0-9]+@admin\.tdmu\.edu\.vn$/;
    if (!studentEmailRegex.test(email) && !adminEmailRegex.test(email)) {
      Alert.alert(
        "Lỗi đăng nhập",
        "Chỉ được đăng nhập bằng tài khoản sinh viên của Trường"
      );
      return;
    }
  
    try {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const isAdmin = await checkAdminPrivileges(user.uid);
        if (isAdmin === true) {
          login('admin', user.uid);
          navigation.navigate('AdminScreen');
        } else {
          login('user', user.uid);
        }
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert("Lỗi đăng nhập", errorMessage);
      });
  } catch (error) {
    if (error instanceof Error) {
      Alert.alert("Lỗi đăng nhập", error.message);
      console.error(error.message);
    } else {
      Alert.alert("Lỗi đăng nhập", "An unknown error occurred");
    }
  }
  };
  

  const handleNavigateToRegister = () => {
    navigation.navigate('DangKy');
  };

  const handleNavigateToForgotPassword = () => {
    navigation.navigate('QuenMatKhau');
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
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={handleNavigateToRegister}>
          <Text style={styles.linkText}>Đăng ký tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToForgotPassword}>
          <Text style={styles.linkText}>Quên mật khẩu?</Text>
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
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#0066cc",
    fontSize: 15,
  },
});

export default DangNhap;
