import { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import colors from '../../config/colors';
import Logo from '../../assets/imgs/logo.svg';
import type { WelcomeStackParamList } from '../../types';
import AppButton from '../../components/AppButton';
import Screen from '../../components/Screen';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const navigation = useNavigation<NativeStackNavigationProp<WelcomeStackParamList>>();

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    if (token != null) { navigate('/home'); }
  };

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <Screen style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={260} height={240} />
      </View>
      <View style={styles.buttonContainer}>
        <AppButton
          title="LOGIN"
          color={'darkOrange'}
          onPress={() => navigation.navigate('Login')}
        />
        <AppButton
          title="REGISTER"
          color={'orange'}
          onPress={() => navigation.navigate('Register')}
        />
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => navigation.navigate('Forgot Password')}
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
    fontFamily: 'Montserrat-Regular',
    color: colors.white,
  },
});
