import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route } from 'react-router-native';
import * as Font from "expo-font";
import WelcomeStack from './app/stacks/WelcomeStack';
import HomeStack from './app/stacks/HomeStack';
import AppLoading from 'expo-app-loading';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import colors from './app/config/colors';
import Icon from './app/components/Icon';

const loadFonts = async () => {
  await Font.loadAsync({
    'Montserrat-ExtraLight': require('./app/assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-Light': require('./app/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Regular': require('./app/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-Medium': require('./app/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('./app/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold': require('./app/assets/fonts/Montserrat-ExtraBold.ttf'),
    'Montserrat-Black': require('./app/assets/fonts/Montserrat-Black.ttf'),
  })
  return true;
}

const toastConfig = {
  success: ({ text1 }) => (
    <View style={styles.successContainer}>
      <Icon
        name="check-bold"
        backgroundColor={colors.green}
        iconColor={colors.white}
        style={{ paddingRight: 10 }}
        size={35}
      />
      <Text style={[styles.notificationText, { color: colors.green }]}>
        {text1}
      </Text>
    </View>
  ),
  error: ({ text1 }) => (
    <View style={styles.errorContainer}>
      <Icon
        name="exclamation-thick"
        backgroundColor={colors.red}
        iconColor={colors.white}
        style={{ paddingRight: 10 }}
        size={35}
      />
      <Text style={[styles.notificationText, { color: colors.red }]}>
        {text1}
      </Text>
    </View>
  ),
};

export default function App(props) {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!isLoaded) { return <AppLoading startAsync={loadFonts} onFinish={() => setIsLoaded(true)} onError={() => {}} />}

  return (
    <NativeRouter>
      <Route exact path="/" component={WelcomeStack} />
      <Route path="/home" component={HomeStack} />
      <Toast config={toastConfig} />
    </NativeRouter>
  );
}

const styles = StyleSheet.create({
  successContainer: {
    minHeight: 60,
    height: 'auto',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  errorContainer: {
    minHeight: 60,
    height: 'auto',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  notificationText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.bg,
    paddingLeft: 10,
    width: '88%'
  },
});
