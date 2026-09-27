import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const ADVISOR_NAME_KEY = 'hdfc.advisorName';
const TOKEN_KEY = 'hdfc.advisorToken';
const TOKEN_VALUE = 'advisor-token-1001';

const NETWORK_IDLE = 'idle';
const NETWORK_LOADING = 'loading';
const NETWORK_SUCCESS = 'success';
const NETWORK_ERROR = 'error';

export default function Settings() {
  const [nameInput, setNameInput] = useState('');
  const [savedName, setSavedName] = useState('');
  const [tokenStatus, setTokenStatus] = useState('');
  const [networkState, setNetworkState] = useState(NETWORK_IDLE);
  const [networkResult, setNetworkResult] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const name = await AsyncStorage.getItem(ADVISOR_NAME_KEY);
        if (name) setSavedName(name);
      } catch (e) {
        console.warn('Failed to read advisor name', e);
      }

      try {
        const existingToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (existingToken) {
          setTokenStatus('Token saved');
        }
      } catch (e) {
        console.warn('Failed to read token', e);
      }
    })();
  }, []);

  const saveName = async () => {
    const trimmed = nameInput.trim();
    try {
      await AsyncStorage.setItem(ADVISOR_NAME_KEY, trimmed);
      setSavedName(trimmed);
    } catch (e) {
      console.warn('Failed to save advisor name', e);
    }
  };

  const issueToken = async () => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, TOKEN_VALUE);
      const readBack = await SecureStore.getItemAsync(TOKEN_KEY);
      if (readBack === TOKEN_VALUE) {
        setTokenStatus('Token saved');
      }
    } catch (e) {
      console.warn('Failed to issue token', e);
    }
  };

  const checkNetwork = async () => {
    setNetworkState(NETWORK_LOADING);
    setNetworkResult('');
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
      if (!response.ok) {
        setNetworkState(NETWORK_ERROR);
        setNetworkResult('Network error');
        return;
      }
      const data = await response.json();
      setNetworkState(NETWORK_SUCCESS);
      setNetworkResult(data.name);
    } catch (e) {
      setNetworkState(NETWORK_ERROR);
      setNetworkResult('Network error');
    }
  };

  const breakNetwork = async () => {
    setNetworkState(NETWORK_LOADING);
    setNetworkResult('');
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/this-will-404-xyz'
      );
      if (!response.ok) {
        setNetworkState(NETWORK_ERROR);
        setNetworkResult('Network error');
        return;
      }
      const data = await response.json();
      setNetworkState(NETWORK_SUCCESS);
      setNetworkResult(JSON.stringify(data));
    } catch (e) {
      setNetworkState(NETWORK_ERROR);
      setNetworkResult('Network error');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Settings</Text>

      {/* AsyncStorage demo */}
      <Text style={styles.sectionTitle}>Advisor profile</Text>
      <Text style={styles.label}>Advisor name</Text>
      <TextInput
        style={styles.input}
        value={nameInput}
        onChangeText={setNameInput}
        placeholder="Enter your name"
      />
      <Pressable style={styles.button} onPress={saveName}>
        <Text style={styles.buttonText}>Save name</Text>
      </Pressable>
      <Text style={styles.savedText}>Advisor: {savedName}</Text>

      {/* SecureStore demo */}
      <Text style={styles.sectionTitle}>Advisor token</Text>
      <Pressable style={styles.button} onPress={issueToken}>
        <Text style={styles.buttonText}>Issue token</Text>
      </Pressable>
      {tokenStatus ? <Text style={styles.savedText}>{tokenStatus}</Text> : null}

      {/* Network demo */}
      <Text style={styles.sectionTitle}>Network</Text>
      <View style={styles.buttonRow}>
        <Pressable style={styles.buttonFlex} onPress={checkNetwork}>
          <Text style={styles.buttonText}>Check network</Text>
        </Pressable>
        <Pressable style={styles.buttonFlex} onPress={breakNetwork}>
          <Text style={styles.buttonText}>Break network</Text>
        </Pressable>
      </View>
      {networkState === NETWORK_LOADING && <Text style={styles.savedText}>Loading</Text>}
      {networkState === NETWORK_SUCCESS && (
        <Text style={styles.savedText}>{networkResult}</Text>
      )}
      {networkState === NETWORK_ERROR && (
        <Text style={styles.error}>{networkResult}</Text>
      )}

      {/* Deep link notes */}
      <Text style={styles.sectionTitle}>Deep link</Text>
      <Text style={styles.note}>
        Scheme: hdfclife{'\n'}
        Example: hdfclife://policy/HDFC-LIFE-1004{'\n'}
        Opening this URL navigates straight to that policy's Policy Detail
        screen, the same screen you reach by tapping the row in the
        Policies list.
      </Text>
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
    paddingBottom: 48,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#004C8C',
    marginTop: 20,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  buttonFlex: {
    flex: 1,
    backgroundColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  savedText: {
    marginTop: 10,
    fontSize: 15,
    color: '#1a1a1a',
  },
  error: {
    marginTop: 10,
    color: '#c0392b',
    fontWeight: '600',
  },
  note: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
});
