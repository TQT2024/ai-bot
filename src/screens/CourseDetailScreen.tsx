import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

interface CourseDetailScreenProps {
  route: {
    params: {
      courseTitle: string;
      courseUrl: string;
    };
  };
  navigation: StackNavigationProp<RootStackParamList, 'CourseDetailScreen'>;
}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({ route, navigation }) => {
  const { courseTitle, courseUrl } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Trường Đại Học Thủ Dầu Một</Text>
      </View>
      <WebView source={{ uri: courseUrl }} style={styles.webview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.02,
    backgroundColor: '#000066',
  },
  greeting: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: "#fff"
  },
  backButton: {
    marginRight: width * 0.03,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default CourseDetailScreen;
