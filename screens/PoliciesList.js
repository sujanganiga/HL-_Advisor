import React from 'react';
import { View, Text, FlatList, Pressable, Image, StyleSheet } from 'react-native';
import policies from '../data/policies.json';

export default function PoliciesList({ navigation }) {
  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={() => navigation.navigate('PolicyDetail', { policyNo: item.policyNo })}
    >
      <View style={styles.rowTextWrap}>
        <Text style={styles.policyNo}>{item.policyNo}</Text>
        <Text style={styles.customer}>{item.customer}</Text>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={require('../assets/icon.png')} style={styles.logo} />
        <Text style={styles.heading}>Policies</Text>
      </View>
      <FlatList
        data={policies}
        keyExtractor={(item) => item.policyNo}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 10,
    borderRadius: 6,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  listContent: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowPressed: {
    backgroundColor: '#f0f4f8',
  },
  rowTextWrap: {
    flexDirection: 'column',
  },
  policyNo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004C8C',
  },
  customer: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
});
