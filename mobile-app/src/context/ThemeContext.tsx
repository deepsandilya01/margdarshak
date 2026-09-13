import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'nativewind';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [theme, setThemeState] = useState<Theme>('system');
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('bis-sathi-theme').then((stored) => {
      if (stored) {
        setThemeState(stored as Theme);
      } else {
        setThemeState('light'); // default
      }
      setIsReady(true);
    });
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('bis-sathi-theme', newTheme);
  };

  useEffect(() => {
    if (!isReady) return;

    const applyTheme = () => {
      let dark = false;
      if (theme === 'system') {
        dark = Appearance.getColorScheme() === 'dark';
        setColorScheme('system');
      } else {
        dark = theme === 'dark';
        setColorScheme(dark ? 'dark' : 'light');
      }
      setIsDark(dark);
    };

    applyTheme();
    
    if (theme === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme: newScheme }) => {
        applyTheme();
      });
      return () => subscription.remove();
    }
  }, [theme, isReady]);

  if (!isReady) return null; // or a loader

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
}
