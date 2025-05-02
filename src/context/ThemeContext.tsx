// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEME_COLORS, TYPOGRAPHY, SPACING, SHADOWS, BORDER_RADIUS } from '../constants/theme';

// Define theme types
export type ThemeName = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: typeof THEME_COLORS;
  typography: typeof TYPOGRAPHY;
  spacing: typeof SPACING;
  shadows: typeof SHADOWS;
  borderRadius: typeof BORDER_RADIUS;
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme() as 'light' | 'dark';
  const [themeName, setThemeName] = useState<ThemeName>('system');
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeName');
        if (savedTheme) {
          setThemeName(savedTheme as ThemeName);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };
    
    loadThemePreference();
  }, []);
  
  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem('themeName', themeName);
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    };
    
    saveThemePreference();
  }, [themeName]);
  
  // For now, we'll only implement light theme
  // You can add dark theme colors later
  const theme = THEME_COLORS;
  
  // Function to change theme
  const handleSetThemeName = (name: ThemeName) => {
    setThemeName(name);
  };
  
  return (
    <ThemeContext.Provider
      value={{
        theme,
        typography: TYPOGRAPHY,
        spacing: SPACING,
        shadows: SHADOWS,
        borderRadius: BORDER_RADIUS,
        themeName,
        setThemeName: handleSetThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};