import React, { type ComponentType } from 'react';
import { View } from 'react-native';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/Welcome/WelcomeScreen';
import LoginScreen from '../screens/Welcome/LoginScreen';
import RegisterScreen from '../screens/Welcome/RegisterScreen';
import ForgotPasswordScreen from '../screens/Welcome/ForgotPasswordScreen';
import EmailCodeScreen from '../screens/Welcome/EmailCodeScreen';
import PasswordResetScreen from '../screens/Welcome/PasswordResetScreen';
import colors from '../config/colors';
import type { WelcomeStackParamList } from '../types/welcomeStackParamList';
import { map } from 'lodash';
import { screenOptions } from './Home/screenOptions';

const Welcome_Stack = createNativeStackNavigator<WelcomeStackParamList>();

const screens: ReadonlyArray<{
  name: keyof WelcomeStackParamList;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  icon: keyof typeof MaterialCommunityIconsType.glyphMap;
  title?: string;
}> = [
  {
    name: 'Welcome',
    component: WelcomeScreen,
    icon: 'home',
  }, {
    name: 'Login',
    component: LoginScreen,
    icon: 'login',
    title: 'Login',
  }, {
    name: 'Register',
    component: RegisterScreen,
    icon: 'account-plus',
    title: 'Register',
  }, {
    name: 'ForgotPassword',
    component: ForgotPasswordScreen,
    icon: 'lock-reset',
    title: 'Reset Password',
  }, {
    name: 'EmailCode',
    component: EmailCodeScreen,
    icon: 'email-check',
    title: 'Email Code',
  }, {
    name: 'PasswordReset',
    component: PasswordResetScreen,
    icon: 'lock-check',
    title: 'Password Reset',
  },
];

export default function WelcomeStack() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Welcome_Stack.Navigator screenOptions={screenOptions}>
          {map(screens, (screen) => (
            <Welcome_Stack.Screen
              key={screen.name}
              name={screen.name}
              component={screen.component}
              options={{ title: screen.title || screen.name }}
            />
          ))}
        </Welcome_Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
