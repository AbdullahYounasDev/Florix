import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function TabLayout() {
  return (
    <>
    <StatusBar style='dark'/>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5D8A6F',
        tabBarInactiveTintColor: '#A1887F',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F5E8',
          height: 80,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop:5,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Your Crops',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "leaf" : "leaf-outline"} 
              size={focused ? 24 : 18} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="florix-bot"
        options={{
          title: 'Florix Bot',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="smart-toy" size={focused ? 24 : 18} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={focused ? 24 : 18} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
    </>
  );
}