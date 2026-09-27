import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';

import PoliciesList from './screens/PoliciesList';
import PolicyDetail from './screens/PolicyDetail';
import ClaimForm from './screens/ClaimForm';
import HospitalBill from './screens/HospitalBill';
import BranchMap from './screens/BranchMap';
import Settings from './screens/Settings';

// Show notifications while the app is foregrounded (so the demo is visible
// even without backgrounding the app).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const PoliciesStack = createNativeStackNavigator();
const ClaimStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PoliciesStackScreen() {
  return (
    <PoliciesStack.Navigator>
      {/* This is the app's home screen, so the native header shows the
          app-wide title. The screen body itself shows the "Policies"
          section heading. */}
      <PoliciesStack.Screen
        name="PoliciesList"
        component={PoliciesList}
        options={{ title: 'HDFC Life Advisor' }}
      />
      <PoliciesStack.Screen
        name="PolicyDetail"
        component={PolicyDetail}
        options={{ title: 'Policy Detail' }}
      />
    </PoliciesStack.Navigator>
  );
}

function ClaimStackScreen() {
  return (
    <ClaimStack.Navigator>
      <ClaimStack.Screen
        name="ClaimForm"
        component={ClaimForm}
        options={{ title: 'File a Claim' }}
      />
      <ClaimStack.Screen
        name="HospitalBill"
        component={HospitalBill}
        options={{ title: 'Hospital Bill' }}
      />
    </ClaimStack.Navigator>
  );
}

// Deep link config: hdfclife://policy/HDFC-LIFE-1004 -> Policies tab -> PolicyDetail
const linking = {
  prefixes: ['hdfclife://'],
  config: {
    screens: {
      Policies: {
        screens: {
          PoliciesList: 'policies',
          PolicyDetail: 'policy/:policyNo',
        },
      },
      Claim: {
        screens: {
          ClaimForm: 'claim',
          HospitalBill: 'claim/bill',
        },
      },
      Map: 'map',
      Settings: 'settings',
    },
  },
};

export default function App() {
  const navigationRef = useRef();

  useEffect(() => {
    // Ask for notification permission once up front so the Claim flow
    // doesn't have to block on it mid-submit.
    Notifications.requestPermissionsAsync().catch(() => {});
  }, []);

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <StatusBar style="auto" />
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#004C8C',
        }}
      >
        <Tab.Screen name="Policies" component={PoliciesStackScreen} />
        <Tab.Screen name="Claim" component={ClaimStackScreen} />
        <Tab.Screen name="Map" component={BranchMap} options={{ title: 'Map' }} />
        <Tab.Screen name="Settings" component={Settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
