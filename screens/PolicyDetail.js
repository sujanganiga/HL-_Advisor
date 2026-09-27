import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';
import policies from '../data/policies.json';

export default function PolicyDetail({ route }) {
  const { policyNo } = route.params || {};
  const policy = policies.find((p) => p.policyNo === policyNo);

  if (!policy) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Policy Detail</Text>
        <Text>Policy not found: {String(policyNo)}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Policy Detail</Text>

      <Image source={require('../assets/icon.png')} style={styles.logo} />

      <View style={styles.card}>
        <Row label="Policy No." value={policy.policyNo} />
        <Row label="Customer" value={policy.customer} />
        <Row label="Type" value={policy.type} />
        <Row label="Base Premium" value={String(policy.basePremium)} />
        <Row label="Status" value={policy.status} />
      </View>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f7f9fc',
    borderRadius: 10,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e8ef',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
