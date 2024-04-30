import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './LoginPage/Main';
import HomeLogin from './LoginPage/HomeLogin';
import Login from './LoginPage/Login';
import Signup from './LoginPage/Signup';
import Welcome from './LoginPage/Welcome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const parsedUserData = JSON.parse(storedUserData);
          setUserData({
            isLoggedIn: true,
            userId: parsedUserData.userId,
            // Other user data properties...
          });
        } else {
          setUserData({
            isLoggedIn: false,
            userId: null,
            // Other default or error state data...
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle errors, set default or error state if necessary
      }
    };

    fetchUserData();
  }, []);

  if (userData === null) {
    return (
      <View style={styles.loading}>
        <Image source={require('./assets/adaptive-icon.png')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          {userData.isLoggedIn ? (
            <>
              <Stack.Screen name='Main' component={Main} options={{ headerShown: false }} />
              <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
              <Stack.Screen name='HomeLogin' component={HomeLogin} options={{ headerShown: false }} />
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
            </>
          ) : (
            <>
              <Stack.Screen name='HomeLogin' component={HomeLogin} options={{ headerShown: false }} />
              <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
              <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
              <Stack.Screen name='Welcome' component={Welcome} options={{ headerShown: false }} />
              <Stack.Screen name='Main' component={Main} options={{ headerShown: false }} />


            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
