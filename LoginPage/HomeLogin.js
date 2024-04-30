import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Background from './Background';
import Btn from './Btn';
import { darkGreen, green } from './Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeLogin = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserLogin();
  }, []);

  const checkUserLogin = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        props.navigation.replace('Welcome');
      }
      setIsLoading(false); // Update loading state when fetch is done
    } catch (error) {
      console.error('Error checking user data:', error);
      setIsLoading(false); // Set loading to false in case of error
    }
  };

  return (
    <Background>
      <View style={{ marginHorizontal: 40, marginVertical: 100 }}>
        <Text style={{ color: 'white', fontSize: 40 }}>Get started with</Text>
        <Text style={{ color: 'white', fontSize: 40, marginBottom: 40 }}>iConstruct</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="white" /> // Display loading indicator while fetching user data
        ) : (
          <View>
            <View style={styles.bt}>
              <Btn bgColor={green} textColor='white' btnLabel="Login" Press={() => props.navigation.replace("Login")} />
            </View>
            <View style={styles.bg}>
              <Btn bgColor='white' textColor={darkGreen} btnLabel="Signup" Press={() => props.navigation.replace("Signup")} />
            </View>
          </View>
        )}
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  bg: {
    alignItems: 'center'
  }
});

export default HomeLogin;
