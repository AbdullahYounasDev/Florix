import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#5D8A6F',
        tabBarInactiveTintColor: '#A1887F',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F5E8',
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Your Crops',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.selectedTab : undefined}>
              <Ionicons 
                name={focused ? "leaf" : "leaf-outline"} 
                size={focused ? 24 : 22} 
                color={focused ? '#FFFFFF' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="florix-bot"
        options={{
          title: 'Florix Bot',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.selectedTab : undefined}>
              <MaterialCommunityIcons 
                name={focused ? "robot-angry" : "robot-angry-outline"}  
                size={focused ? 24 : 22} 
                color={focused ? '#FFFFFF' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.selectedTab : undefined}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={focused ? 24 : 22} 
                color={focused ? '#FFFFFF' : color} 
              />
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Developer',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.selectedTab : undefined}>
              <Ionicons 
                name={focused ? "bug" : "bug-outline"} 
                size={focused ? 24 : 22} 
                color={focused ? '#FFFFFF' : color} 
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  selectedTab: {
    backgroundColor: '#5D8A6F',
    width: 38,
    height: 38,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: '#5D8A6F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  } as const, // Add 'as const' to fix TypeScript inference
});