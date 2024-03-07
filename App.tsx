import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [navigationSubscription, setNavigationSubscription] =
    useState<Location.LocationSubscription | null>(null);

  useEffect(() => {
    if (navigationSubscription) {
      return () => {
        navigationSubscription.remove();
      };
    }
  });

  async function startNavigation() {
    console.log('starting');
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      console.error('Location permission not granted');

      return;
    }

    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 0,
      },
      (location) => {
        for (let i = 0; i < 5; i += 1) {
          const {
            coords: { latitude, longitude },
            timestamp,
          } = location;

          console.log(timestamp);

          setLatitude(latitude);
          setLongitude(longitude);
          setTimestamp(timestamp);
        }
      }
    );

    setNavigationSubscription(locationSubscription);
  }

  const stopNavigation = () => {
    navigationSubscription?.remove();
  };

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <View>
        <Pressable onPress={startNavigation}>
          <Text>Start</Text>
        </Pressable>
      </View>
      <View>
        <Pressable onPress={stopNavigation}>
          <Text>Stop</Text>
        </Pressable>
      </View>
      {latitude && longitude && (
        <>
          <Text>Latitude: {String(latitude)}</Text>
          <Text>Longitude: {String(longitude)}</Text>
          <Text>Timestamp: {timestamp}</Text>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
