import { View } from 'react-native';
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
import type { RootStackParamList } from '../types/rootStackParamList';

const Welcome_Stack = createNativeStackNavigator<RootStackParamList>();

export default function WelcomeStack() {
  return (
    <NavigationContainer>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <Welcome_Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.black,
            },
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
          }}
        >
          <Welcome_Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerTitleAlign: 'center' }}
          />
          <Welcome_Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerTitle: () => <SmallLogo width={100} height={20} />,
              headerTitleAlign: 'center',
            }}
          />
          <Welcome_Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              headerTitle: () => <SmallLogo width={110} height={20} />,
              headerTitleAlign: 'center',
            }}
          />
          <Welcome_Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              headerTitle: () => <SmallLogo width={110} height={20} />,
              headerTitleAlign: 'center',
            }}
          />
          <Welcome_Stack.Screen
            name="EmailCode"
            component={EmailCodeScreen}
            options={{
              headerTitle: () => <SmallLogo width={110} height={20} />,
              headerTitleAlign: 'center',
            }}
          />
          <Welcome_Stack.Screen
            name="PasswordReset"
            component={PasswordResetScreen}
            options={{
              headerTitle: () => <SmallLogo width={110} height={20} />,
              headerTitleAlign: 'center',
            }}
          />
        </Welcome_Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}
