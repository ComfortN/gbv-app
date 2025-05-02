// app/tabs/_layout.tsx

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { THEME_COLORS } from '../../src/constants/theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          
          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'mood-journal') {
            iconName = focused ? 'journal' : 'journal-outline';
          } else if (route.name === 'resources') {
            iconName = focused ? 'compass' : 'compass-outline';
          }
          
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: THEME_COLORS.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        }
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home',
          headerShown: false,
        }} 
      />
      
      <Tabs.Screen 
        name="chat" 
        options={{ 
          title: 'Chat',
          headerShown: false,
        }} 
      />
      
      <Tabs.Screen 
        name="mood-journal" 
        options={{ 
          title: 'Mood',
        }} 
      />
      
      <Tabs.Screen 
        name="resources" 
        options={{ 
            title: 'Resources',
            }} 
            />

      

    </Tabs>
  );
}