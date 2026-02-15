import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { Screen, WelcomeAuthTabParamList } from '@/types';
import { screenOptions } from '@/navigation/stacks/screenOptions';
import WelcomeScreen from '@/screens/Welcome/WelcomeScreen';
import LoginScreen from '@/screens/Welcome/LoginScreen';
import RegisterScreen from '@/screens/Welcome/RegisterScreen';
import ForgotPasswordScreen from '@/screens/Welcome/ForgotPasswordScreen';
import EmailCodeScreen from '@/screens/Welcome/EmailCodeScreen';
import PasswordResetScreen from '@/screens/Welcome/PasswordResetScreen';

const Auth_Tab = createNativeStackNavigator<WelcomeAuthTabParamList>();

const screens: ReadonlyArray<Screen<WelcomeAuthTabParamList>> = [{
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

export default function AuthTab() {
  return (
    <Auth_Tab.Navigator screenOptions={screenOptions}>
      {screens.map((screen) => (
        <Auth_Tab.Screen
          component={screen.component}
          key={screen.name}
          name={screen.name}
        />
      ))}
    </Auth_Tab.Navigator>
  );
}
