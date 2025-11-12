import React, { type ComponentType } from 'react';
import { View } from 'react-native';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import EmailCodeScreen from '../screens/EmailCodeScreen';
import PasswordResetScreen from '../screens/PasswordResetScreen';
import colors from '../config/colors';
import SmallLogo from '../assets/imgs/small_logo.svg';
import type { WelcomeStackParamList } from '../types/welcomeStackParamList';
import { map } from 'lodash';
import { screenOptions } from './Home/screenOptions';

const Welcome_Stack = createNativeStackNavigator<WelcomeStackParamList>();

const screens: ReadonlyArray<{
  name: keyof WelcomeStackParamList;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  icon: keyof typeof MaterialCommunityIconsType.glyphMap;
  titleWidth?: number;
}> = [
  {
    name: 'Welcome',
    component: WelcomeScreen,
    icon: 'home',
  }, {
    name: 'Login',
    component: LoginScreen,
    icon: 'login',
    titleWidth: 100,
  }, {
    name: 'Register',
    component: RegisterScreen,
    icon: 'account-plus',
    titleWidth: 110,
  }, {
    name: 'ForgotPassword',
    component: ForgotPasswordScreen,
    icon: 'lock-reset',
    titleWidth: 110,
  }, {
    name: 'EmailCode',
    component: EmailCodeScreen,
    icon: 'email-check',
    titleWidth: 110,
  }, {
    name: 'PasswordReset',
    component: PasswordResetScreen,
    icon: 'lock-check',
    titleWidth: 110,
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
              options={{
                headerTitleAlign: 'center',
                headerTitle: () => screen.titleWidth == null
                  ? null
                  : <SmallLogo width={screen.titleWidth} height={20} />,
              }}
            />
          ))}
        </Welcome_Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
