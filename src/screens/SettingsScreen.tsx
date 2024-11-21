import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={25} color="#000" />
        <Text style={styles.backText}>Quay lại</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.title}>Cài đặt</Text>
      </View>

      {/* Hiển thị thông báo */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Cho phép hiển thị thông báo</Text>
        <Switch />
      </View>

      {/* Thay đổi màu nền */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Thay đổi màu nền</Text>
        <View style={styles.colorOptions}>
          <View style={[styles.colorBox, { backgroundColor: '#f8f9fa' }]} />
          <View style={[styles.colorBox, { backgroundColor: '#d1c4e9' }]} />
          <View style={[styles.colorBox, { backgroundColor: '#b3e5fc' }]} />
          <View style={[styles.colorBox, { backgroundColor: '#ffe0b2' }]} />
        </View>
      </View>

      {/* Tài khoản */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Tài khoản</Text>
      </TouchableOpacity>

      {/* Liên hệ */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Liên hệ</Text>
      </TouchableOpacity>

      {/* Chia sẻ */}
      <TouchableOpacity style={styles.settingItem}>
        <Text style={styles.settingText}>Chia sẻ</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop:25,
  },
  backText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  settingText: {
    fontSize: 18,
  },
  colorOptions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});

export default SettingsScreen;
