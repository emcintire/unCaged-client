import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import Logo from '../assets/imgs/logo.svg';
import Screen from '../components/Screen';
import type { WelcomeStackParamList } from '../types';

export default function WelcomeScreen({ navigation }: NativeStackScreenProps<WelcomeStackParamList, 'Welcome'>) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token != null) {
          navigate('/home');
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkToken();
  }, [navigate]);

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
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    width: '100%',
    height: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
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
