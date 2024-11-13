import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddCalendarDrawer = () => {
  return (
    <View style={styles.container}>
      <Text>Thêm Sự Kiện</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AddCalendarDrawer;
