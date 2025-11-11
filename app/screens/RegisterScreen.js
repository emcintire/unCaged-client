import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import PasswordInput from '../components/PasswordInput';
import { showErrorToast } from '../config/helperFunctions';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string()
    .required()
    .label('Password')
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    ),
  confirmPassword: Yup.string()
    .required()
    .label('Password')
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    ),
});

function RegsisterScreen(props) {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }

    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/users/',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email.toLowerCase(),
          password: values.password,
        }),
      }
    );

    const body = await response.text();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      await AsyncStorage.setItem('token', body);
      navigate('/home');
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Register</Text>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{ name: '', email: '', password: '' }}
          onSubmit={(values) => handleSubmit(values)}
          validationSchema={validationSchema}
        >
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Name"
            textContentType="name"
          />
          <AppFormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <PasswordInput
            name="password"
            placeholder="Password"
          />
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <SubmitButton
            title="Register"
            style={styles.registerButton}
          />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: colors.bg,
    height: '100%',
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    height: '100%',
    width: '100%',
  },
  formContainer: {
    width: '100%',
    top: 15,
  },
  registerButton: {
    marginTop: 30,
  },
  tagline: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 40,
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});

export default RegsisterScreen;
