import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SecureStore from 'expo-secure-store';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { QueryClientProvider } from '@tanstack/react-query';
import type { RootStackParamList } from '@/types';
import { queryClient } from '@/services';
import { colors, toastConfig, layout } from '@/config';
import WelcomeStack from '@/navigation/stacks/WelcomeStack';
import HomeStack from '@/navigation/stacks/Home/HomeStack';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const loadFonts = async (): Promise<boolean> => {
  await Font.loadAsync({
    'Montserrat-ExtraLight': require('@/assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-Light': require('@/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('@/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold': require('@/assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-Black': require('@/assets/fonts/Montserrat-Black.ttf'),
  });
  return true;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        const token = await SecureStore.getItemAsync('token');
        if (token != null) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to load fonts:', error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (!isLoading) { await SplashScreen.hideAsync(); }
  }, [isLoading]);

  if (isLoading) { return null; }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView} edges={['bottom', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor={colors.black} translucent={false} />
        <GestureHandlerRootView style={styles.container}>
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }} initialRouteName={isAuthenticated ? 'Home' : 'Welcome'}>
              <RootStack.Screen name="Welcome" component={WelcomeStack} />
              <RootStack.Screen name="Home" component={HomeStack} />
            </RootStack.Navigator>
          </NavigationContainer>
          <Toast config={toastConfig} />
        </GestureHandlerRootView>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    ...layout.container,
    backgroundColor: colors.black,
  },
});
