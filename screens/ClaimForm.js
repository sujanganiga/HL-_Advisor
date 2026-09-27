import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const CLAIMS_KEY = 'hdfc.claims';
const URGENCY_LEVELS = ['HIGH', 'MEDIUM', 'LOW'];

export default function ClaimForm({ navigation }) {
  const [policyNo, setPolicyNo] = useState('');
  const [amount, setAmount] = useState('');
  const [urgency, setUrgency] = useState('MEDIUM');
  const [hospital, setHospital] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccessMsg('');
    setNotifMsg('');

    if (!policyNo.trim()) {
      setError('Policy number is required');
      return;
    }

    const claim = {
      policyNo: policyNo.trim(),
      amount: amount ? Number(amount) : 0,
      urgency,
      hospital: hospital.trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      const existingRaw = await AsyncStorage.getItem(CLAIMS_KEY);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push(claim);
      await AsyncStorage.setItem(CLAIMS_KEY, JSON.stringify(existing));
    } catch (e) {
      // Persistence failure shouldn't crash the submit flow.
      console.warn('Failed to persist claim', e);
    }

    setSuccessMsg(`Claim submitted for ${claim.policyNo}`);

    // Schedule the local notification. If permission was denied, save the
    // claim anyway and surface a message instead of crashing.
    try {
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;
      if (status !== 'granted') {
        const req = await Notifications.requestPermissionsAsync();
        finalStatus = req.status;
      }

      if (finalStatus !== 'granted') {
        setNotifMsg('Notification permission denied');
      } else {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'HDFC Life',
            body: `Claim submitted for ${claim.policyNo}`,
          },
          trigger: null, // fire immediately
        });
      }
    } catch (e) {
      console.warn('Notification scheduling failed', e);
      setNotifMsg('Notification permission denied');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>File a Claim</Text>

      <Text style={styles.label}>Policy number</Text>
      <TextInput
        style={styles.input}
        value={policyNo}
        onChangeText={setPolicyNo}
        placeholder="e.g. HDFC-LIFE-1001"
        autoCapitalize="characters"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g. 25000"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Urgency</Text>
      <View style={styles.urgencyRow}>
        {URGENCY_LEVELS.map((level) => (
          <Pressable
            key={level}
            onPress={() => setUrgency(level)}
            style={[
              styles.urgencyButton,
              urgency === level && styles.urgencyButtonSelected,
            ]}
          >
            <Text
              style={[
                styles.urgencyText,
                urgency === level && styles.urgencyTextSelected,
              ]}
            >
              {level}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Hospital (optional)</Text>
      <TextInput
        style={styles.input}
        value={hospital}
        onChangeText={setHospital}
        placeholder="e.g. Lilavati Hospital"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit claim</Text>
      </Pressable>

      {successMsg ? <Text style={styles.success}>{successMsg}</Text> : null}
      {notifMsg ? <Text style={styles.error}>{notifMsg}</Text> : null}

      <Pressable
        style={styles.billButton}
        onPress={() => navigation.navigate('HospitalBill')}
      >
        <Text style={styles.billButtonText}>Attach hospital bill photo</Text>
      </Pressable>
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
    marginBottom: 16,
    color: '#1a1a1a',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  urgencyRow: {
    flexDirection: 'row',
  },
  urgencyButton: {
    borderWidth: 1,
    borderColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 8,
  },
  urgencyButtonSelected: {
    backgroundColor: '#004C8C',
  },
  urgencyText: {
    color: '#004C8C',
    fontWeight: '600',
  },
  urgencyTextSelected: {
    color: '#fff',
  },
  error: {
    color: '#c0392b',
    marginTop: 12,
  },
  success: {
    color: '#1a7a3c',
    marginTop: 12,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#004C8C',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  billButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  billButtonText: {
    color: '#004C8C',
    fontWeight: '600',
  },
});
