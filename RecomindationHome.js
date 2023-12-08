import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenReco } from './HomeSreenReco';

import { View,StyleSheet,SafeAreaView,Image ,Text,Pressable } from 'react-native';
export const RecomindationHome=()=>{
    const navigation = useNavigation();

    const goToRecomindation = () => {
        // Navigate to the login screen or route
        navigation.navigate('HomeScreenReco'); // Replace 'Login' with your actual login screen name or route
      };
    
    return(
        
<SafeAreaView style={{flex:1,backgroundColor:"white"}}>
    <StatusBar translucent backgroundColor='rgba(0,0,0,0)'/>
<Image source={require("../assets/onboard3.jpg")}style={styles.image}></Image>
<View style={styles.indicatecontainer}> 
<View style={styles.indecator}>
</View>
<View style={styles.indecator}>
</View>
<View style={[styles.indecator,styles.indecatorActive]}
>
</View>

        </View>
        <View style={{paddingHorizontal:20,paddingTop:10}}>
            <Text style={styles.title}>FIND DREAM  </Text>
            <Text style={styles.title}>HOME & VEHICLE </Text>
            
            <View style={{marginTop: 10}}>
          <Text style={styles.textStyle}>
          Purchase with few clicks          </Text>
          <Text style={styles.textStyle}> homes or cars!</Text>
        </View>
        <View>
                <Image style={{marginLeft:100,height:160,width:160}} source={require("../assets/logoo1.png")}></Image>
            </View>
        </View>

             <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: 40,
        }}>
        {/* button */}
        <Pressable onPress={goToRecomindation}>
          <View style={styles.btn}>
            <Text style={{color: 'white'}}>Get Started</Text>
          </View>
        </Pressable>
      </View>
        
        
</SafeAreaView>
       
    )
   
}
const styles=StyleSheet.create({
    image:{
        height:420,
        width:'100%',
        borderBottomLeftRadius:100,
    },
    indicatecontainer:{
height:20,
flexDirection:'row',
justifyContent:'center',
alignItems:'center'
    },
    indecator:{
        height:3,
        width:30,
        backgroundColor:'#A9A9A9',
        marginHorizontal:5,
        borderRadius:5,
    },
    indecatorActive:{
     backgroundColor:'#000'
    },
    title:{
        fontSize:32,
        fontWeight:"bold"
    },
    textStyle: {fontSize: 16, color: "#A9A9A9"},
    btn:{
        
        height:60,
        marginHorizontal:20,
        backgroundColor:"black",
        borderRadius:15,
        justifyContent:"center",
        alignItems:"center"
    }
})