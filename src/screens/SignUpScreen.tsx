import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type AuthStackNavigationProp = DrawerNavigationProp<RootStackParamList, 'AuthStack'>;

const DangKy = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();

    return (
        <View style={styles.container}>
          <Text style={styles.title}>Đăng ký</Text>
    
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
          />
    
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            secureTextEntry={true}
          />
    
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#888"
            secureTextEntry={true}
          />
    
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Đăng ký</Text>
          </TouchableOpacity>
    
          <TouchableOpacity style={styles.linkContainer} onPress={() => navigation.navigate('DangNhap')}>
            <Text style={styles.linkText}>Đã có tài khoản? Đăng nhập</Text>
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
    
    export default DangKy;
    