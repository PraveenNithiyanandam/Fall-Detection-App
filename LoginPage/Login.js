import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen } from './Constants';
import axios from 'axios';
import Field from './Field';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation

  const handleLogin = async () => {
    try {
      const API_KEY = 'AIzaSyCV8cYlQqq62RnKHOwHKrlCuF7Sp7h_4sw'; // Replace with your Firebase API key
      const response = await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      });

      if (response.data?.idToken) {
        console.log('Login Response:', response.data); // Log the response from the server
        alert('Logged In');
        navigation.replace('Welcome'); // Navigate to 'Welcome' screen upon successful login
      } else {
        alert('Login failed for another reason');
      }
    } catch (error) {
      console.error('Login Error:', error.response?.data || error.message);
      if (error.response?.data?.error?.message === 'INVALID_LOGIN_CREDENTIALS') {
        alert('Invalid email or password');
      } else {
        alert('Login failed. Please try again.');
      }
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
          Login
        </Text>
        <View
          style={{
            backgroundColor: 'white',
            height: 800,
            width: 460,
            borderTopLeftRadius: 130,
            paddingTop: 100,
            alignItems: 'center',
          }}>
          <Text style={{ fontSize: 40, color: darkGreen, fontWeight: 'bold', paddingRight: 90 }}>
            Welcome Back
          </Text>
          <Text
            style={{
              color: 'grey',
              fontSize: 19,
              fontWeight: 'bold',
              marginBottom: 20,
              paddingRight: 170,
            }}>
            Login to your account!
          </Text>
          <View style={{ width: 400 }}>
            <Field placeholder="Email Address" keyboardType={'email-address'} onChangeText={setEmail} />
          </View>
          <View style={{ width: 400 }}>
            <Field placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
          </View>

          <Btn textColor="white" bgColor={darkGreen} btnLabel="Login" Press={handleLogin} />
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '100', color: 'black' }}>Don't have an account ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={{ color: '#0A66C2', fontWeight: '900', fontSize: 16, marginRight: 40 }}>Signup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default Login;
