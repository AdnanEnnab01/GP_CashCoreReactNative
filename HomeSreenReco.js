import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  Dimensions,
  FlatList,
  Image,
  Scro,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';

import houses from '../houses';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalSelector from 'react-native-modal-selector';
import DetailsScreen from './DetailsScreen';
import { BuyCarHouse } from './BuyCarHouse';
const {width} = Dimensions.get('screen');

export const Card = ({house, navigation}) => {
  return (
    <Pressable
      activeOpacity={0.8}
      onPress={() => navigation.navigate('DetailsScreen', house)}>
      <View style={styles.card}>
        {/* House image */}
        <Image source={house.image} style={styles.cardImage} />
        <View style={{marginTop: 10}}>
          {/* Title and price container */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {house.title}
            </Text>
            <Text
              style={{fontWeight: 'bold', color: '#5f82e6', fontSize: 16}}>
              $1,500
            </Text>
          </View>

          {/* Location text */}

          <Text style={{color: "#A9A9A9", fontSize: 14, marginTop: 5}}>
            {house.location}
          </Text>

          {/* Facilities container */}
          <View style={{marginTop: 10, flexDirection: 'row'}}>
            <View style={styles.facility}>
              <Icon name="hotel" size={18} />
              <Text style={styles.facilityText}>2</Text>
            </View>
            <View style={styles.facility}>
              <Icon name="bathtub" size={18} />
              <Text style={styles.facilityText}>2</Text>
            </View>
            <View style={styles.facility}>
              <Icon name="aspect-ratio" size={18} />
              <Text style={styles.facilityText}>100m</Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
};
export const HomeScreenReco = () => {
    const navigation = useNavigation();
    const goToDetailsScreen = () => {
        // Navigate to the login screen or route
        navigation.navigate('DetailsScreen'); // Replace 'Login' with your actual login screen name or route
      };
     
    const categoryList = ['Popular', 'Recommended', 'Nearest'];
    const ListCategories=()=>{
        const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);
        return (
        <View style={styles.categorycontainer}>
 {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => setSelectedCategoryIndex(index)}>
            <Text
              style={[
                styles.categoryListText,
                index == selectedCategoryIndex && styles.activeCategoryListText,
              ]}>
              {category}
            </Text>
          </Pressable>
        ))}
            </View>
            )
    }
    
 
  
const ListOption = () => {
  const navigation = useNavigation(); // Fetch the navigation object

  const optionsList = [
    { title: 'Buy a House', img: require('../assets/Home.jpg') ,screen: 'BuyHouses'},
    { title: 'Buy a Car', img: require('../assets/car.jpg'),screen: 'BuyCarHouse' },
  ];

  const handleOptionPress = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.optionliststyle}>
      {optionsList.map((option, index) => (
        <Pressable
          key={index}
          onPress={() => handleOptionPress(option.screen)}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.9 : 1,
            },
            styles.optionsCard,
          ]}
        >
          <View style={styles.optionsCard}>
            <Image source={option.img} style={styles.optionsCardImage} />
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
              {option.title}
            </Text>
          </View>
        </Pressable>
      ))}
    </View>
  );
};
  return (
    <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
      <StatusBar
        translucent={false}
        backgroundColor="white"
        barStyle="dark-content"
      ></StatusBar>
      <View style={styles.header}>
        <View>
        <Image source={require("../assets/logoo1.png")} style={{width:70,height:70}}></Image>
        </View>
        <Image
          source={require('../assets/profile.jpg')}
          style={styles.profileImage}
        ></Image>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
          }}
        >
          <View style={styles.SearchInputcontainer}>
            <Icon name="search" size={25} color="#A9A9A9"></Icon>
            <TextInput placeholder="Name, City of product you looking for"></TextInput>
          </View>
          <View style={styles.sortBtn}>
            <Icon name="tune" color="white" size={25}></Icon>
          </View>
        </View>
        <ListOption />
        <ListCategories />
        <FlatList
          snapToInterval={width - 20}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
          horizontal
          data={houses}
          renderItem={({item}) => <Card house={item}  navigation={navigation}/>}
        />
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  optionliststyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  optionsCardImage:{
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginTop: 14,
    
  },
  optionsCard:{
    height: 210,
    width:width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: "white",
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,

  },
  card:{marginTop:7,
    height: 270,
    backgroundColor: "white",
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
  },
  SearchInputcontainer: {
    height: 50,
    backgroundColor: '#f6f6f6',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cardImage:{
    marginTop:5,
    width: '100%',
    height: 120,
    borderRadius: 15,
  },
  sortBtn: {
    backgroundColor: 'black',
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  categorycontainer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  activeCategoryListText:{
    color: "black",
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListText:{
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: "#A9A9A9",
  },
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: "#A9A9A9"},
});
