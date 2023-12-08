import React, { useState } from 'react';
import Signup from './Signup';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RecomindationHome } from './RecomindationHome';
import Login from './Login';
export default HomeScreen = () => {
  
  const [isKeyboardOpen, setKeyboardOpen] = useState(false);

  const clearOnboarding = async () => {
    try {
      await AsyncStorage.removeItem('@viewedOnboarding');
    } catch (err) {
      console.log('Error @clearOnboarding:', err);
    }
  };

  Keyboard.addListener('keyboardDidShow', () => {
    setKeyboardOpen(true);
  });
  Keyboard.addListener('keyboardDidHide', () => {
    setKeyboardOpen(false);
  });

  return (
    <View style={styles.container}>
      <Login />
      {!isKeyboardOpen && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={clearOnboarding} style={styles.button}>
            <Text>Clear Onboarding</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  imgDiv: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
  },
});
