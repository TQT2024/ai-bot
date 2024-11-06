// screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const HomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Trường Đại Học Thủ Dầu Một</Text>
        <View style={styles.headerIcons}>
          <Icon name="bell" size={20} color="#fff" style={styles.icon} />
          <Icon name="bars" size={20} color="#fff" />
        </View>
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
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: "#000066", 
    marginTop: 22,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff"
    
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  bannerContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  banner: {
    width: '90%',
    padding: 20,
    backgroundColor: '#ffecf0',
    borderRadius: 15,
    alignItems: 'center',
  },
  discountText: {
    fontSize: 12,
    color: '#ff6347',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    fontSize: 14,
    color: '#3F51B5',
  },
  subjectsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  subject: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3F51B5',
    borderRadius: 10,
    width: 80,
  },
  subjectText: {
    color: '#fff',
    marginTop: 5,
  },
  coursesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  courseCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  courseImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  coursePrice: {
    fontSize: 14,
    color: '#FF6347',
    marginTop: 5,
  },
  courseIcon: {
    position: 'absolute', 
    top: 10,
    left: 10,
  },
});

export default HomeScreen;
