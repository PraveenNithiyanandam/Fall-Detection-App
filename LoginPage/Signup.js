

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Field from './Field';

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSignUp = async () => {
    const { email, password } = formData;

    if (email !== formData.confirmEmail) {
      console.error('Emails do not match');
      return;
    }

    if (password !== formData.confirmPassword) {
      console.error('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      console.log('Sign-up successful:', response.data);
      alert('Account created');

      // Store user data after successful sign-up
      await AsyncStorage.setItem('userData', JSON.stringify({ email, password }));

      navigation.replace('Welcome'); // Navigate to 'Welcome' page after successful sign-up
    } catch (error) {
      console.error('Sign-up failed:', error.message);
      alert('Sign-up failed. Please try again.');
    }
  };




  return (
    <Background>
      <View style={{ alignItems: 'center', width: 460 }}>
        <Text
          style={{
            color: 'white',
            fontSize: 64,
            fontWeight: 'bold',
            marginTop: 20,
            marginLeft: 50,
          }}>
          Register
        </Text>
        <Text
          style={{
            color: 'white',
            fontSize: 19,
            fontWeight: 'bold',
            marginBottom: 20,
            marginLeft: 90,
          }}>
          Create a new account!
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 700,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 50,
            alignItems: 'center',
          }}>
          <View style={styles.placeholder}>
            <Field
              placeholder="Email Address"
              keyboardType={'email-address'}
              onChangeText={(text) => handleInputChange('email', text)} // Update here
            />
          </View>
          <View style={styles.placeholder}>
            <Field
              placeholder="Confirm Email Address"
              keyboardType={'email-address'}
              onChangeText={(text) => handleInputChange('confirmEmail', text)} // Update here
            />
          </View>
          <View style={styles.placeholder}>
            <Field
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => handleInputChange('password', text)} // Update here
            />
          </View>
          <View style={styles.placeholder}>
            <Field
              placeholder="Confirm Password"
              secureTextEntry={true}
              onChangeText={(text) => handleInputChange('confirmPassword', text)} // Update here
            />
          </View>
          <Btn
            textColor="white"
            bgColor={darkGreen}
            btnLabel="Signup"
            Press={handleSignUp}
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              Already have an account ?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>
              <Text
                style={{
                  color: '#0A66C2',
                  fontWeight: 'bold',
                  fontSize: 20,
                  paddingRight: 20,
                }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};


export default Signup;

const styles = StyleSheet.create({
  placeholder: {
    width: 400,
  },
});
