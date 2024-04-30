import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Alert, Vibration, TouchableOpacity, View } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import axios from 'axios';
import { encode } from 'base-64';
import * as Location from 'expo-location';
import { AntDesign } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Main({ navigation }) {
  const [fallDetected, setFallDetected] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState([]);
  const [gyroscopeData, setGyroscopeData] = useState([]);
  const [sound, setSound] = useState();
  const [gmapLink, setGmapLink] = useState('');

  const playAlertSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../LoginPage/assets/alertAudio.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  };

  const updateLatestSensorData = (data, setData) => {
    setData(prevData => [...prevData.slice(-2), data]);
  };


  const checkAndRequestLocationPermission = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Access Required',
          'This app requires access to your location for fall detection. Please grant location access in settings.'
        );
        return false; // Permission denied
      }
      return true; // Permission granted
    } catch (error) {
      console.error('Error requesting location permission:', error);
      Alert.alert('Error', 'An error occurred while requesting location permission.');
      return false; // Permission request error
    }
  };

  const fetchUserData = async () => {
    try {
      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        return userData;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    return null;
  };

  const sendFallAlert = async (userData) => {
    try {
      let location = await Location.getCurrentPositionAsync({});
      const updatedGmapLink = `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}`;
      console.log('Google Maps link:', updatedGmapLink);
      setGmapLink(updatedGmapLink);

      if (!updatedGmapLink) {
        console.log('Google Maps link not available');
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission denied.');
        return;
      }

      const serverResponse = await axios.post('https://oniontrove.techmedok.com/a/b.php', {
        fallDetected: true,
        timestamp: new Date().toISOString(),
        location: location.coords,
        gmap_link: updatedGmapLink,
        userData: userData,
      });

      console.log('Data sent to server successfully:', serverResponse.data);
      console.log('UserData after sending:', userData);

      await sendSMSWithLink(updatedGmapLink);
    } catch (error) {
      console.error('Error:', error.message);
      Alert.alert('Error occurred while sending data to the server.');
    }
  };

  const sendSMSWithLink = async (link) => {
    try {
      if (!link) {
        console.log('Google Maps link not available');
        return;
      }

      const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
      const recipientPhoneNumber = process.env.RECIPIENT_PHONE_NUMBER;

      const url = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages`;

      const authHeader = 'Basic ' + encode(`${twilioAccountSid}:${twilioAuthToken}`);

      const body = new URLSearchParams({
        Body: `Fall detected! Need assistance! ${link}`,
        From: twilioPhoneNumber,
        To: recipientPhoneNumber,
      }).toString();

      const twilioResponse = await axios.post(url, body, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': authHeader,
        },
      });

      console.log('SMS sent successfully to recipient:', recipientPhoneNumber);
      console.log('Twilio response:', twilioResponse.data);
    } catch (error) {
      console.error('Error sending SMS:', error.message);
      Alert.alert('Error occurred while sending SMS.');
    }
  };

   
  useEffect(() => {
    const accelerometerThreshold = 1.5;
    const gyroscopeThreshold = 0.5;
    const COLLECTION_INTERVAL = 1000;

    let accelerometerValues = [];
    let gyroscopeValues = [];

    const checkForFall = async () => {
      const lastAccData = accelerometerValues[accelerometerValues.length - 1];
      const lastGyroData = gyroscopeValues[gyroscopeValues.length - 1];

      if (!lastAccData || !lastGyroData) return;

      const totalAcceleration = Math.sqrt(lastAccData.x * lastAccData.x + lastAccData.y * lastAccData.y + lastAccData.z * lastAccData.z);
      const totalGyroRotation = Math.sqrt(lastGyroData.x * lastGyroData.x + lastGyroData.y * lastGyroData.y + lastGyroData.z * lastGyroData.z);

      console.log('Total Acceleration:', totalAcceleration);
      console.log('Total Gyroscope Rotation:', totalGyroRotation);

      const isFallDetected = totalAcceleration > accelerometerThreshold && totalGyroRotation > gyroscopeThreshold;

      if (isFallDetected) {
        console.log('Potential fall detected!');
        setFallDetected(true);
        playAlertSound();
        Vibration.vibrate(500);
        Alert.alert('Fall Detected', 'Sending alert and location to emergency contacts.');

        const locationPermissionGranted = await checkAndRequestLocationPermission();
        if (locationPermissionGranted) {
          const userData = await fetchUserData();
          sendFallAlert(userData);
        }
      }
    };

    const accelerometerSubscription = Accelerometer.addListener(data => {
      updateLatestSensorData(data, setAccelerometerData);
      accelerometerValues.push(data);

    });

    const gyroscopeSubscription = Gyroscope.addListener(data => {
      updateLatestSensorData(data, setGyroscopeData);
      gyroscopeValues.push(data);

    });


    const checkFallInterval = setInterval(() => {
      checkForFall();
    }, COLLECTION_INTERVAL);

    return () => {
      accelerometerSubscription.remove();
      gyroscopeSubscription.remove();
      clearInterval(checkFallInterval);
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  return (
    
    <ScrollView contentContainerStyle={styles.container}>
      {/* Profile Icon */}
      <TouchableOpacity
  onPress={() => {
    console.log('Profile icon pressed!');
    navigation.navigate('Welcome');
  }}
  style={styles.profileIcon}
>
  <AntDesign name="user" size={40} color="black" />
  <Text style={{ textAlign: 'center' }}>Profile</Text>
</TouchableOpacity>


      {/* Fall Detection Status */}
      <View style={[styles.section, { marginTop: 150 }]}>
        <Text style={styles.heading}>Fall Detection Status:</Text>
        <Text style={styles.status}>{fallDetected ? 'Fall Detected' : 'No Fall Detected'}</Text>
      </View>

      {/* Accelerometer Data */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.heading}>Acceleration Data:</Text>
        {accelerometerData.map((data, index) => (
          <Text key={`acc_${index}`} style={styles.data}>
            x: {data.x.toFixed(2)}, y: {data.y.toFixed(2)}, z: {data.z.toFixed(2)}
          </Text>
        ))}
      </View>

      {/* Gyroscope Data */}
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={styles.heading}>Gyroscope Data:</Text>
        {gyroscopeData.map((data, index) => (
          <Text key={`gyro_${index}`} style={styles.data}>
            x: {data.x.toFixed(2)}, y: {data.y.toFixed(2)}, z: {data.z.toFixed(2)}
          </Text>
        ))}
      </View>
    </ScrollView>
  
  );
}

export default Main;

const styles = StyleSheet.create({
  profileIcon: {
    position: 'absolute',
    top: 50,
    right: 40,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF', // Set a background color for the whole screen
  },
  section: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F0F0F0', // Lighter background color for sections
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333', // Darker text color for headings
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  data: {
    fontSize: 16,
    marginTop: 5,
    color: '#444444', // Darker text color for data
  },
});