import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Foundation, AntDesign, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#121212', // Spotify dark background
          borderTopWidth: 0,
          height: 75,
        },
        tabBarActiveTintColor: '#FFF', // Spotify green
        tabBarInactiveTintColor: '#B3B3B3', // Gray
        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Foundation name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <AntDesign name="search1" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="playlists"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color }) => (
            <FontAwesome6 name="lines-leaning" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user-circle-o" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
