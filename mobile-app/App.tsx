import "./global.css";
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Image, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';

import { ThemeProvider } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { WorkspaceProvider } from './src/context/WorkspaceContext';

function SplashScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#E6F4FE', alignItems: 'center', justifyContent: 'center' }}>
      <Image 
        source={require('./assets/icon.png')} 
        style={{ width: 120, height: 120, borderRadius: 24, marginBottom: 24 }}
        resizeMode="contain"
      />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#0047e1', marginBottom: 4 }}>BIS-SATHI</Text>
      <Text style={{ fontSize: 13, color: '#5f6368', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 32 }}>Standards · Simplified</Text>
      <ActivityIndicator size="small" color="#b89752" />
    </View>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initialization: session, language, theme restoration
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <WorkspaceProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </WorkspaceProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
