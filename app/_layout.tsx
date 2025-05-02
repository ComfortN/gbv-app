import { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { Slot } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context providers
import { UserProvider } from '../src/context/UserContext';
import { ThemeProvider } from '../src/context/ThemeContext';

// Components
import LoadingScreen from '../src/components/LoadingScreen';

export default function RootLayout() {

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if this is the first app launch
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          // First time launching
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (error) {
        console.error('Error checking app launch status:', error);
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkFirstLaunch();
  }, []);

  // Redirect to onboarding if first launch
  useEffect(() => {
    if (isFirstLaunch === true) {
      router.push('/onboarding');
    }
  }, [isFirstLaunch, router]);

  // Show a loading state while checking first launch
  if (isLoading) {
    return <LoadingScreen />;
  }


  return (
  <SafeAreaProvider>
      <StatusBar style="auto" />
      <ThemeProvider>
        <UserProvider>
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="tabs" />
          </Stack>
        </UserProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
