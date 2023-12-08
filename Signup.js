import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Login from "./Login"
import { Animated } from 'react-native';
import { makeRequest } from '../axios';
import {
  TouchableOpacity,
  TextInput,
  View,
  Text,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalSelector from 'react-native-modal-selector';
const photo = require('../assets/signup.png');

const Signup = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState(''); // New state for user_id
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);
  const scaleValue = useRef(new Animated.Value(0)).current;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthdayValidationMessage, setBirthdayValidationMessage] =
    useState('');
    const handleBackToLogin = () => {
      // Navigate to the login screen or route
      navigation.navigate('Login'); // Replace 'Login' with your actual login screen name or route
    };
    useEffect(() => {
      if (isSignUpSuccess) {
        showSuccessAnimation();
      }
    }, [isSignUpSuccess]);
    const showSuccessAnimation = () => {
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };
  
  useEffect(() => {
    if (selectedOption === 'Saving account') {
    } else if (selectedOption === 'Current account') {
    } else if (selectedOption === 'Deposit account') {
    }
  }, [selectedOption]);
  const validateUsername = (text) => {
    return /^[\w]+\s[\w]+$/.test(text);
  };

  const validateEmail = (text) => {
    // Your email validation logic here
    return /^\w+([-]?\w+)*@\w+([.-]?\w+)*\.\w+([.-]?\w+)*$/.test(text);
  };

  const validatePassword = (text) => {
    // Your password validation logic here
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(text);
  };
  const validateBirthday = (date) => {
    // Check if birthday is empty
    if (!date) {
      setValidationMessage('Must be 18 years or older');

      return true;
    }

    // Your remaining birthday validation logic here
    const birthDate = new Date(date);
    const currentDate = new Date();
    const age = currentDate.getFullYear() - birthDate.getFullYear();

    if (age < 18) {
      setValidationMessage('Must be 18 years or older');
      return false;
    } else {
      setValidationMessage('');
      return true;
    }
  };

  const validatePhoneNumber = (text) => {
    // Your phone number validation logic here
    return /^\d{10}$/.test(text);
  };

  const handleSignUp = async () => {
    const isUserIdValid = /^\d{9}$/.test(userId);
    const isUsernameValid = validateUsername(username);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isPasswordsMatch = password === confirmPassword;
    const isBirthdayValid = validateBirthday(birthday);
    const isPhoneNumberValid = validatePhoneNumber(phoneNumber);
    
   
    // ... (your JSX and return statement)

    if (!/^\d{9}$/.test(userId)) {
      setValidationMessage('User ID must be a 9-digit number');
      return;
    }
    if (!validateUsername(username)) {
      setValidationMessage('Please enter a valid username');
    } else if (!validateEmail(email)) {
      setValidationMessage('Please enter a valid email');
    } else if (!validatePassword(password)) {
      setValidationMessage('Please enter a stronger password');
    } else if (password !== confirmPassword) {
      setValidationMessage('Passwords do not match');
    } else if (!validateBirthday(birthday)) {
      setValidationMessage('Must be 18 years or older');
    } else if (!validatePhoneNumber(phoneNumber)) {
      setValidationMessage('Enter a valid number');
    } else if (!selectedOption) {
      setValidationMessage('Please choose an account type');
    }
    const hasValidationErrors = !!validationMessage;
     if (
      isUserIdValid &&
      isUsernameValid &&
      isEmailValid &&
      isPasswordValid &&
      isPasswordsMatch &&
      isBirthdayValid &&
      isPhoneNumberValid &&
      selectedOption
    ) {
      try {
        const response = await axios.post(
          'http://192.168.1.56:8800/api/CreateNewWaitingAccountRoutes/signup',
          {
            user_id: userId,
            UserName: username,
            email: email,
            BirthDay: birthday,
            phone_number: phoneNumber,
            accountType: selectedOption,
            Password: password,
          },
        );
  
        console.log('API Response:', response.data);
        setIsSignUpSuccess(true); // Set sign-up success flag
        // Handle successful response (e.g., redirect, show success message)
      } catch (error) {
        
        setIsSignUpSuccess(false); // Set sign-up failure flag
        // Handle error (show error message, log, etc.)
        if (error.response && error.response.data && error.response.data.message) {
          setValidationMessage(error.response.data.message);
        } else {
          setValidationMessage('Failed to sign up. Please try again.');
        }
      }
    } else {
      setValidationMessage('Please fill in all required fields correctly.');
    
      
    }
    
  };
  const renderSuccessModal = () => {
    if (isSignUpSuccess) {
      return (
        <View style={styles.modalContainer}>
          <Animated.View
            style={[
              styles.successBox,
              {
                transform: [{ scale: scaleValue }],
              },
            ]}
          >
                        <Image
              style={styles.logo}
              source={require('../assets/logoo1.png')}
            />
            <Icon name="check-circle" size={80} color="#FFD700" />
            <Text style={styles.successMessage}>Sign up successfully!</Text>
            <TouchableOpacity
      style={styles.backButton}
      onPress={handleBackToLogin} // Call function to navigate to login
    >
      <Text style={styles.backButtonText}>Back to Login</Text>
    </TouchableOpacity>
          </Animated.View>
        </View>
      );
    }
    return null;
  };
  const renderSelectedOption = () => {
    if (selectedOption !== '') {
      return (
        <Text style={styles.selectedText}>
          Choose Account Type: {selectedOption}
        </Text>
      );
    }
    return null;
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Join Our Exciting Adventure!</Text>

        <View style={styles.imageAndLogoContainer}>
          <View style={styles.imageContainer}>
            <Image style={styles.photostyle} source={photo} />
          </View>
          <View style={styles.logoContainer}>
            <Image
              style={styles.logo}
              source={require('../assets/logoo1.png')}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Icon name="badge" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="User ID"
            onChangeText={(text) => setUserId(text)} // Update the state for user_id
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="person" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon
            name="alternate-email"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={true}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="call" size={20} color="black" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="numeric"
            onChangeText={(text) => setPhoneNumber(text)}
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon
            name="celebration"
            size={20}
            color="black"
            style={styles.icon}
          />
          <TextInput
            style={styles.input}
            placeholder="Birthday (YYYY-MM-DD)"
            onChangeText={(text) => setBirthday(text)}
          />
        </View>

        <ModalSelector
          data={[
            { key: 0, label: 'Saving Account' },
            { key: 1, label: 'Current Account' },
            { key: 2, label: 'Deposit Account' },
          ]}
          initValue={
            selectedOption !== '' ? selectedOption : 'Choose Account Type'
          }
          onChange={(option) => setSelectedOption(option.label)}
          style={styles.dropdown}
          optionTextStyle={{ color: 'black' }} // Update prop name or usage here if needed
        />
        <Text style={{ marginBottom: 3, color: 'red' }}>
          {validationMessage}
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      {renderSuccessModal()}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 100,
    backgroundColor: 'white',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity as needed
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  dropdown: {
    height: 100,
    minWidth: 120,
  },
  imageAndLogoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionText: {
    color: 'darkgray', // Set the text color of the options to black
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
  selectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  dropdown: {
    height: 40, // Adjust the height of the dropdown
    minWidth: 120, // Adjust the width of the dropdown
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  photostyle: {
    width: 400,
    height: 200,
  },
  imageContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    width: 350,
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    marginTop: 3,
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },

  button: {
    backgroundColor: '#FFDB58',
    width: 200,
    height: 25,
    alignItems: 'center',
    borderColor: '#FFDB58',
    borderWidth: 1,
    borderRadius: 10,
    height: 40,
  },
  buttonText: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#ffffff',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 10,
    right: 55,
  },
  logo: {
    width: 120,
    height: 120,
  },
  modalContainer: {
    flex: 1,
    marginBottom:300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successBox: {
    backgroundColor: '#005C53',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  successMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
  },

});

export default Signup;
