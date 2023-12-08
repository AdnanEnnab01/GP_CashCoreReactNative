import React, { useState, useEffect } from "react";
import { View, Text, Pressable, TextInput,StyleSheet, Dimensions, TouchableOpacity,Image,ScrollView } from "react-native";
import { useNavigation } from '@react-navigation/native'; // Import the useNavigation hook
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('screen');
import productPhotoPaths from "../productConfig";
const Card = ({ item, navigation }) => {
 

  const imageSource = productPhotoPaths[item.product_photo] || null;  return (
    <Pressable
    activeOpacity={0.8}
    onPress={() => navigation.navigate('DetailsScreen', { item: item })}>
      <View style={styles.card}>
      <Image
          source={imageSource}
          style={styles.cardImage}
        />
        <View style={{marginTop: 10}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>
              {item.product_name}
            </Text>
            <Text
              style={{fontWeight: 'bold', color: '#5f82e6', fontSize: 16}}>
              ${item.product_price}
            </Text>
          </View>

          <Text style={{color: '#A9A9A9', fontSize: 14, marginTop: 5}}>
            {item.product_description}
          </Text>

          <View style={{marginTop: 10, flexDirection: 'row'}}>
            {/* Add more views for other car information */}
          </View>
        </View>
      </View>
    </Pressable>
  );
};
const SearchComponent = ({ handleSearch, setSearchText }) => {
    return (
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
          <Icon name="search" size={25} color="#FFF" />
        </TouchableOpacity>
      </View>
    );}
export const BuyHouses = () => {
    const [searchText, setSearchText] = useState('');

    const [houseProducts, setHouseProducts] = useState([]);
    const navigation = useNavigation();
    
    useEffect(() => {
      handleGetProducts();
    }, []);
  
    const handleGetProducts = () => {
      fetch('http://192.168.1.56:8800/api/product/house')
        .then((response) => response.json())
        .then((data) => {
          setHouseProducts(data);
        })
        .catch((error) => {
          console.error('Error fetching house products:', error);
        });
    };
  
    const handleSearch = () => {
        // Implement your search logic based on searchText
        if (!searchText.trim()) {
          // If the search text is empty, fetch all car products
          handleGetProducts();
        } else {
          // If there's a price entered, fetch cars under that price
          fetch(`http://192.168.1.56:8800/api/product/house/${searchText}`)
            .then((response) => response.json())
            .then((data) => {
              setHouseProducts(data);
            })
            .catch((error) => {
              console.error('Error fetching car products by price:', error);
            });
        }    // Additional logic to filter products based on searchText if needed
      };
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
          <View style={styles.searchContainer}>
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        onChangeText={(text) => setSearchText(text)}
      />
      <TouchableOpacity style={styles.iconContainer} onPress={handleSearch}>
        <Icon name="search" size={25} color="#FFF" />
      </TouchableOpacity>
    </View>
        <ScrollView>
          <View style={{ marginVertical: 20, alignItems: 'center' }}>
            {houseProducts.length > 0 ? (
              houseProducts.map((product, index) => (
                <Card key={index} item={product} navigation={navigation} />
              ))
            ) : (
              <Text>No house products available</Text>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  

const styles = StyleSheet.create({
    buttonContainer: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    btn: {
      height: 60,
      marginHorizontal: 20,
      backgroundColor: "black",
      borderRadius: 15,
      justifyContent: "center",
      alignItems: "center",
      width: '90%',
      alignSelf: 'center',
    },
    btnText: {
      color: 'white',
    },
    productContainer: {
      marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#A9A9A9',
        borderRadius: 25,
        width:360,
        marginLeft:10,
        paddingHorizontal: 10,
        marginTop: 10,
      },
      input: {
        flex: 1,
        paddingVertical: 8,
        color: '#FFF',
      },
      iconContainer: {
        padding: 10,
      },
    boldText: {
      fontWeight: 'bold',
    },
    card: {
      marginTop: 7,
      height: 270,
      backgroundColor: "white",
      elevation: 10,
      width: width - 40,
      marginRight: 20,
      padding: 15,
      borderRadius: 20,
    },
    cardImage: {
      marginTop: 5,
      width: '100%',
      height: 120,
      borderRadius: 15,
    },
  });
  
  

export default BuyHouses