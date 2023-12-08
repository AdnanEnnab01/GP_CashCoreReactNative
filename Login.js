import React from 'react';
import { useState ,useRef,useEffect} from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import InnerScreen from './InnerScreen';
import NavigationContainer from '@react-navigation/native';
import { KeyboardAvoidingView,Platform,ScrollView,Keyboard } from 'react-native';
import { Animated } from 'react-native';
import axios from 'axios';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Login = () => {
  const navigation = useNavigation();
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [activationshowModal, activationsetShowModal] = useState(false);

  const [modalOpacity] = useState(new Animated.Value(0));
  const goToInnerScreen = () => {
    // Navigate to the login screen or route
    navigation.navigate('InnerScreen'); // Replace 'Login' with your actual login screen name or route
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://192.168.1.56:8800/api/CreateNewWaitingAccountRoutes/login', {
        email,
        password,
      });

      // Assuming your API returns user data on successful login
      console.log('API Response:', response.data);
      setShowModal(true);
      activationsetShowModal(false)
      // Optional: you can trigger an animation here if needed
      Animated.timing(modalOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        setShowModal(false);
        navigation.navigate('InnerScreen');
      }, 3000);
      // Handle successful login response here, such as setting tokens, navigating to another screen, etc.
    } catch (error) {
      // Handle login error
      setShowModal(false);
  if (error.response && error.response.status === 401 && error.response.data.message === "Please activate your account") {
activationsetShowModal(true)
    // Optional: you can trigger an animation here if needed
    Animated.timing(modalOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();    }
    else{
      Alert.alert("Login failed", "Wrong Email or Password"); // Show specific message for waiting account login failure

    }
    }
  };
  const closeModal = () => {
    setShowModal(false);
    // Animate modal out if needed
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const closeFailedModal = () => {
    activationsetShowModal(false);
    // Animate modal out if needed
    Animated.timing(modalOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const r = require('../assets/login.png');

  const handleSignup = () => {
    navigation.navigate('Signup'); // Navigate to the Signup screen
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      ({ endCoordinates }) => {
        setKeyboardOffset(endCoordinates.height);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
    
  >
    
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }}>Login Now!</Text>
      <View style={styles.imgDiv}>
        <Image style={styles.imgStyle} source={r}></Image>
      </View>
      <View style={styles.inputContainer}>
        <Icon
          name="alternate-email"
          size={20}
          color="gray"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="gray"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="gray"
          secureTextEntry={true}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>

      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            width: 300,
            backgroundColor: '#B2BEBF',
            alignItems: 'center',
            borderColor: '#000000',
            borderRadius: 20,
            borderWidth: 1,
          }}
          onPress={handleLogin}
        >
          <Text
            style={{
              fontSize: 24,
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 10 }} onPress={handleSignup}>
          <Text style={{ fontWeight: 'bold' }}>Create an account</Text>
        </TouchableOpacity>
        <View>
          <Image
            style={{ width: 130, height: 150, marginTop: 10 }}
            source={require('../assets/logoo1.png')}
          ></Image>
        </View>
      </View>
    </View>
    {activationshowModal && (
        <Animated.View style={[styles.failedModalContainer, { opacity: modalOpacity }]}>
          <View style={styles.failedModalContent}>
            <Image style={{ width: 150, height: 200 }} source={require('../assets/logoo1.png')} />
            <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 20, color: 'white' ,fontWeight:"bold"}}>
              Activation Failed: Please activate your account by visiting one of our branches
            </Text>
            <TouchableOpacity onPress={closeFailedModal}>
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    {showModal && (
        <Animated.View style={[styles.modalContainer, { opacity: modalOpacity }]}>
          <View style={styles.modalContent}>
            <Image style={{ width: 150, height: 200 }} source={require('../assets/logoo1.png')} />
            <Image
          source={require('../assets/profile.jpg')}
          style={{ width: 89, height: 80, borderRadius: 10 }}
        ></Image>            
        <Text style={{ fontSize: 20, marginTop: 20, marginBottom: 20, color: 'white' }}>

             Welcome Adnan Ennab
            </Text>
          
          </View>
        </Animated.View>
      )}
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgStyle: {
    width: 350,
    height: 300,
    marginLeft: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    margin: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1, // Set input to take remaining space
    width: '100%', // Ensure input occupies 100% width
  },

  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#042940',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    height: 400,
    justifyContent: 'space-between',
    // Other styles for modal content
  },
  failedModalContainer: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedModalContent: {
    backgroundColor: 'darkred',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: 300,
    height: 400,
    justifyContent: 'space-between',
    // Other styles for modal content
  },
  homeButton: {
    borderColor: '#005C53',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'yellow',
    width: 150,
    height: 30,
  },
});

export default Login;
