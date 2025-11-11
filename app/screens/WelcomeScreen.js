import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import AppButton from '../components/AppButton';
import colors from '../config/colors';
import Logo from '../assets/imgs/logo.svg';
import Screen from '../components/Screen';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function WelcomeScreen(props) {
  const navigate = useNavigate();

  useEffect(() => {
    AsyncStorage.getItem('token')
      .then((token) => {
        if (token !== null) {
          navigate('/home');
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
          onPress={() => props.navigation.navigate('Login')}
        />
        <AppButton
          title="REGISTER"
          color={'orange'}
          onPress={() => props.navigation.navigate('Register')}
        />
        <TouchableOpacity
          style={{ marginTop: 10 }}
          onPress={() => props.navigation.navigate('Forgot Password')}
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

export default WelcomeScreen;
