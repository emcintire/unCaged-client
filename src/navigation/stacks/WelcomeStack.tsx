import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '@/screens/Welcome/WelcomeScreen';
import LoginScreen from '@/screens/Welcome/LoginScreen';
import RegisterScreen from '@/screens/Welcome/RegisterScreen';
import ForgotPasswordScreen from '@/screens/Welcome/ForgotPasswordScreen';
import EmailCodeScreen from '@/screens/Welcome/EmailCodeScreen';
import PasswordResetScreen from '@/screens/Welcome/PasswordResetScreen';
import type { Screen, WelcomeStackParamList } from '@/types';
import { map } from 'lodash';
import { screenOptions } from './screenOptions';

const Welcome_Stack = createNativeStackNavigator<WelcomeStackParamList>();

const screens: ReadonlyArray<Screen<WelcomeStackParamList>> = [{
  component: WelcomeScreen,
  name: 'Welcome',
}, {
  component: LoginScreen,
  name: 'Login',
}, {
  component: RegisterScreen,
  name: 'Register',
}, {
  component: ForgotPasswordScreen,
  name: 'Forgot Password',
}, {
  component: EmailCodeScreen,
  name: 'Email Code',
}, {
  component: PasswordResetScreen,
  name: 'Password Reset',
}];

export default function WelcomeStack() {
  return (
    <Welcome_Stack.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <Welcome_Stack.Screen
          component={screen.component}
          key={screen.name}
          name={screen.name}
        />
      ))}
    </Welcome_Stack.Navigator>
  );
}
