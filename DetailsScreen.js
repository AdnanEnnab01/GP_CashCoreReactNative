import React from 'react';
import {
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('screen');
import productPhotoPaths from "../productConfig";

const DetailsScreen = ({ navigation, route }) => {
  const item = route.params.item;
  const imageSource = productPhotoPaths[item.product_photo] || null;

  // const InteriorCard = ({ interior }) => {
  //   return <Image source={interior} style={style.interiorImage} />;
  // };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.backgroundImageContainer}>
        <ImageBackground style={style.backgroundImage} source={imageSource}>
            <View style={style.header}>
              <View style={style.headerBtn}>
                <Icon
                  name="arrow-back-ios"
                  size={20}
                  onPress={navigation.goBack}
                />
              </View>
              <View style={style.headerBtn}>
                <Icon name="favorite" size={20} color="red" />
              </View>
            </View>
          </ImageBackground>

          <View style={style.virtualTag}>
            <Text style={{ color: '#FFF' }}>Virtual tour</Text>
          </View>
        </View>

        <View style={style.detailsContainer}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
              {item.product_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={style.ratingTag}>
                <Text style={{ color: '#FFF' }}>4.8</Text>
              </View>
              <Text style={{ fontSize: 13, marginLeft: 5 }}>155 ratings</Text>
            </View>
          </View>

          <Text style={{ fontSize: 16, color: '#A9A9A9' }}>
            {item.product_description}
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <View style={style.facility}>
              <Icon name="hotel" size={18} />
              <Text style={style.facilityText}>2</Text>
            </View>
            <View style={style.facility}>
              <Icon name="bathtub" size={18} />
              <Text style={style.facilityText}>2</Text>
            </View>
            <View style={style.facility}>
              <Icon name="aspect-ratio" size={18} />
              <Text style={style.facilityText}>100m area</Text>
            </View>
          </View>

          <Text style={{ marginTop: 20, color: '#A9A9A9' }}>
            {item.product_description}
          </Text>

          <FlatList
            contentContainerStyle={{ marginTop: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, key) => key.toString()}
            data={item.interiors}
            renderItem={({ item }) => <InteriorCard interior={item} />}
          />

          <View style={style.footer}>
            <View>
              <Text style={{ color: '#5f82e6', fontWeight: 'bold', fontSize: 18 }}>
                ${item.product_price}
              </Text>
              <Text style={{ fontSize: 12, color: '#A9A9A9', fontWeight: 'bold' }}>
                Total Price
              </Text>
            </View>
            <View style={style.bookNowBtn}>
              <Text style={{ color: '#FFF' }}>Book Now</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerBtn: {
    height: 50,
    width: 50,
    backgroundColor: '#FFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTag: {
    height: 30,
    width: 35,
    backgroundColor: '#5f82e6',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  virtualTag: {
    top: -20,
    width: 120,
    borderRadius: 10,
    height: 40,
    paddingHorizontal: 20,
    backgroundColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  footer: {
    height: 70,
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000",
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  detailsContainer: {flex: 1, paddingHorizontal: 20, marginTop: 40},
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: "#A9A9A9"},
});

export default DetailsScreen;