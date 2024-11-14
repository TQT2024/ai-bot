import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const { width } = Dimensions.get('window');

const SidebarMenu: React.FC<DrawerContentComponentProps> = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => props.navigation.closeDrawer()}>
        <Icon name="arrow-left" size={width * 0.05} color="#fff" />
      </TouchableOpacity> 
      <TouchableOpacity onPress={() => props.navigation.navigate('HomeStack', { screen: 'Home' })} >
        <Text style={styles.sidebarTitle}>Home</Text>
      </TouchableOpacity>
      {[
        { title: "Quản lý ghi chú", icon: "pencil", screen: "NotesListScreen" },
        { title: "Quản lý chi tiêu", icon: "dollar" },
        { title: "Quản lý lịch trong ngày", icon: "calendar" },
        { title: "Sự kiện quan trọng", icon: "calendar-check-o" },
        { title: "Quản lý âm thanh", icon: "music" },
        { title: "Cài đặt", icon: "cog" },
        { title: "Account", icon: "user" },
      ].map((menuItem, index) => (
        <TouchableOpacity
          style={styles.sidebarItem}
          key={index}
          onPress={() => {
            if (menuItem.screen) {
              props.navigation.navigate(menuItem.screen);
            }
          }}
        >
          <Icon name={menuItem.icon} size={width * 0.05} color="#fff" />
          <Text style={styles.sidebarItemText}>{menuItem.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000066',
    paddingVertical: width * 0.1,
    paddingHorizontal: width * 0.05,
  },
  closeButton: {
    marginBottom: width * 0.05,
  },
  sidebarTitle: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: width * 0.1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: width * 0.04,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
  },
  sidebarItemText: {
    marginLeft: width * 0.04,
    fontSize: width * 0.045,
    color: '#fff',
  },
});

export default SidebarMenu;
