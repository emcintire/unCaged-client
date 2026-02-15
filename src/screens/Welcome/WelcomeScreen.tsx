import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Logo from '@/assets/imgs/logo.svg';
import type { WelcomeAuthTabParamList } from '@/types';
import { colors, fontFamily, spacing } from '@/config';
import AppButton from '@/components/AppButton';
import Screen from '@/components/Screen';

export default function WelcomeScreen() {
  const { navigate } = useNavigation<NativeStackNavigationProp<WelcomeAuthTabParamList>>();

  return (
    <Screen style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={260} height={240} />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="LOGIN"
          color={'darkOrange'}
          onPress={() => navigate('Login')}
        />
        <AppButton
          title="REGISTER"
          color={'orange'}
          onPress={() => navigate('Register')}
        />
        <TouchableOpacity
          style={styles.forgotButton}
          onPress={() => navigate('Forgot Password')}
          accessibilityRole="button"
          accessibilityLabel="Forgot Password"
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '50%',
    width: '60%',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
  },
  forgot: {
    fontFamily: fontFamily.regular,
    color: colors.white,
  },
  forgotButton: {
    marginTop: spacing.sm,
  },
});
