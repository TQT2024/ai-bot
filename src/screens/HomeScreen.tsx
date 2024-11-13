import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import SidebarMenu from '../components/SidebarMenu';

const { width, height } = Dimensions.get('window');


interface HomeScreenProps {
  navigation: DrawerNavigationProp<any>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Icon name="bars" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.greeting}>Trường Đại Học Thủ Dầu Một</Text>
        <Icon name="bell" size={20} color="#fff" style={styles.notiIcon} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <Icon name="search" size={20} color="#a9a9a9" style={styles.searchIcon} />
      </View>

      <View style={styles.bannerContainer}>
        <View style={styles.banner}>
          <Text style={styles.discountText}>Chat AI</Text>
          <Text style={styles.bannerTitle}>WELCOME!</Text>
          <Text style={styles.bannerSubtitle}>Giải đáp những câu hỏi về trường TDMU</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Link</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.subjectsContainer}>
        {[
          { name: "Đkmh", icon: "graduation-cap" },
          { name: "Ctss", icon: "building" },
          { name: "E", icon: "book" },
          { name: "Qlkh", icon: "star" },
        ].map((subject) => (
          <View style={styles.subject} key={subject.name}>
            <Icon name={subject.icon} size={30} color="#fff" />
            <Text style={styles.subjectText}>{subject.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Latest News</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.coursesContainer}>
        {[
          { 
            title: "Thông báo điều chỉnh thời gian đào tạo của sinh viên các khóa 2022 trở về trước", 
            icon: "book", 
            imageUri: 'https://thanhnien.mediacdn.vn/Uploaded/linhnt-qc/2022_02_28/tn2-8506.jpg' 
          },
          { 
            title: "Quyết định sửa đổi, bổ sung quyết định 1774/QĐ-ĐHTDM ngày 17/11/2021", 
            icon: "laptop", 
            imageUri: 'https://tdmu.edu.vn/img/img-kham-pha-tdmu.jpg' 
          },
          { 
            title: "Hướng dẫn vị trí trong trường TDMU", 
            icon: "graduation-cap", 
            imageUri: 'https://kiemdinhvatuvanxaydung.tdmu.edu.vn/img/bt3/images/V%E1%BB%8A%20TR%C3%8D%20PTN1855%20T%E1%BA%A0I%20TDMU.jpg' 
          },
        ].map((course, index) => (
          <View style={styles.courseCard} key={index}>
            <Image source={{ uri: course.imageUri }} style={styles.courseImage} />
            <Text style={styles.courseTitle}>{course.title}</Text>
            
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  header: {
    padding: width * 0.05,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#000066", 
    marginTop: height * 0.06,
  },
  greeting: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: "#fff"
  },
  headerIcons: {
    flexDirection: 'row',
  },
  notiIcon: {
    marginRight: width * 0.04,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: width * 0.05,
    paddingHorizontal: width * 0.04,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: width * 0.04,
    paddingVertical: height * 0.015,
  },
  searchIcon: {
    marginLeft: width * 0.02,
  },
  bannerContainer: {
    alignItems: 'center',
    marginVertical: height * 0.02,
  },
  banner: {
    width: '90%',
    padding: width * 0.05,
    backgroundColor: '#ffecf0',
    borderRadius: 15,
    alignItems: 'center',
  },
  discountText: {
    fontSize: width * 0.03,
    color: '#ff6347',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  bannerTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#000',
  },
  bannerSubtitle: {
    fontSize: width * 0.04,
    color: '#666',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: width * 0.05,
    marginTop: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: width * 0.04,
    color: '#3F51B5',
  },
  subjectsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: height * 0.02,
  },
  subject: {
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: '#3F51B5',
    borderRadius: 10,
    width: width * 0.2,
  },
  subjectText: {
    color: '#fff',
    marginTop: height * 0.01,
  },
  coursesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.05,
  },
  courseCard: {
    width: '48%',
    marginVertical: height * 0.01,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
  },
  courseImage: {
    width: '100%',
    height: height * 0.15,
  },
  courseTitle: {
    padding: width * 0.03,
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#333',
  },
});


export default HomeScreen;
