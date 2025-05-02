import { Stack, useRouter } from "expo-router";
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Context providers
import { ThemeProvider } from '../src/context/ThemeContext';
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {

  return (
  <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
