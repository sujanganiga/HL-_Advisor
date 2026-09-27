import React, { useState } from 'react';
import { View, Text, Pressable, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function HospitalBill() {
  const [photoUri, setPhotoUri] = useState(null);
  const [message, setMessage] = useState('');

  const takePhoto = async () => {
    setMessage('');
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Camera permission denied');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error', e);
      setMessage('Camera permission denied');
    }
  };

  const pickFromGallery = async () => {
    setMessage('');
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setMessage('Gallery permission denied');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (e) {
      console.warn('Gallery error', e);
      setMessage('Gallery permission denied');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Hospital Bill</Text>

      <View style={styles.buttonRow}>
        <Pressable style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Take photo</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={pickFromGallery}>
          <Text style={styles.buttonText}>Choose from gallery</Text>
        </Pressable>
      </View>

      {message ? <Text style={styles.error}>{message}</Text> : null}

      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>No bill photo yet</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  error: {
    color: '#c0392b',
    marginBottom: 12,
  },
  preview: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 12,
  },
  placeholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#f0f2f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  placeholderText: {
    color: '#999',
  },
});
