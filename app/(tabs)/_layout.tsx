import { theme } from '@/utils/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E8F5E8',
          height: 75 + insets.bottom,
          paddingBottom: 8 + insets.bottom,
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
        name="crop-timeline"
        options={{
          title: 'Crop Timeline',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.selectedTab : undefined}>
              <MaterialCommunityIcons 
                name={focused ? "timeline-clock" : "timeline-clock-outline"}  
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
    backgroundColor: theme.colors.primary,
    width: 38,
    height: 38,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});