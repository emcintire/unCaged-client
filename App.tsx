import React, { useEffect, useState, useCallback } from 'react';
import { NativeRouter, Route, Routes } from 'react-router-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { QueryClientProvider } from '@tanstack/react-query';
import WelcomeStack from './app/stacks/WelcomeStack';
import HomeStack from './app/stacks/Home/HomeStack';
import { queryClient } from './app/api/queryClient';
import { toastConfig } from './app/config/toastConfig';
import { StyleSheet } from 'react-native';
import colors from './app/config/colors';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const loadFonts = async (): Promise<boolean> => {
  await Font.loadAsync({
    'Montserrat-ExtraLight': require('./app/assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-Light': require('./app/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Regular': require('./app/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('./app/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('./app/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold': require('./app/assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-Black': require('./app/assets/fonts/Montserrat-Black.ttf'),
  });
  return true;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
      } catch (e) {
        console.warn(e);
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
    <SafeAreaView style={styles.container} onLayout={onLayoutRootView} edges={['bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} translucent={false} />
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <NativeRouter>
            <Routes>
              <Route path="/" element={<WelcomeStack />} />
              <Route path="/home" element={<HomeStack />} />
            </Routes>
            <Toast config={toastConfig} />
          </NativeRouter>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});
