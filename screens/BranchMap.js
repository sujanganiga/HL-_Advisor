import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MUMBAI_BRANCH = { latitude: 19.076, longitude: 72.8777 };

export default function BranchMap() {
  const [myLocation, setMyLocation] = useState(null);
  const [message, setMessage] = useState('');

  const findMyLocation = async () => {
    setMessage('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Location permission denied');
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      setMyLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch (e) {
      console.warn('Location error', e);
      setMessage('Location permission denied');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Branch Map</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: MUMBAI_BRANCH.latitude,
          longitude: MUMBAI_BRANCH.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker coordinate={MUMBAI_BRANCH} title="MUMBAI" />
        {myLocation && <Marker coordinate={myLocation} title="You" pinColor="#1a7a3c" />}
      </MapView>

      <Pressable style={styles.button} onPress={findMyLocation}>
        <Text style={styles.buttonText}>My location</Text>
      </Pressable>

      {message ? <Text style={styles.error}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    padding: 16,
    paddingBottom: 8,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  error: {
    color: '#c0392b',
    textAlign: 'center',
    marginBottom: 12,
  },
});
