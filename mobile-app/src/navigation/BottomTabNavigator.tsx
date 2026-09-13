import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, Sparkles, Search, User } from 'lucide-react-native';
import { MainTabParamList } from './types';
import HomeScreen from '../screens/home/HomeScreen';
import StandardsExplorerScreen from '../screens/standards/StandardsExplorerScreen';
import AISathiScreen from '../screens/ai-sathi/AISathiScreen';
import ExploreScreen from '../screens/explore/ExploreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { LightThemeColors } from '../design-system/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#e65c00',
        tabBarInactiveTintColor: '#4a4643',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#cfcac5',
        },
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          tabBarLabel: 'Home'
        }}
      />
      <Tab.Screen 
        name="Standards" 
        component={StandardsExplorerScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <BookOpen color={color} size={size} />,
          tabBarLabel: 'Standards'
        }}
      />
      <Tab.Screen 
        name="AISathi" 
        component={AISathiScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Sparkles color={color} size={size} />,
          tabBarLabel: 'AI Sathi'
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />,
          tabBarLabel: 'Explore'
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          tabBarLabel: 'Profile'
        }}
      />
    </Tab.Navigator>
  );
}
