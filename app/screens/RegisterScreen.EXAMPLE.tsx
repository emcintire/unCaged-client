/**
 * EXAMPLE: Updated RegisterScreen using TanStack Query
 * 
 * This file demonstrates how to migrate from fetch to TanStack Query
 */

import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';
import { AppForm, AppFormField, PasswordInput, SubmitButton } from '../components/forms';
import { useRegister } from '../api';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string()
    .required()
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    )
    .label('Password'),
});

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterScreen() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = (values: RegisterFormValues): void => {
    registerMutation.mutate(
      {
        name: values.name.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
      },
      {
        onSuccess: () => {
          showSuccessToast('Registration successful!');
          navigate('/home');
        },
        onError: (error) => {
          showErrorToast(error instanceof Error ? error.message : 'Registration failed');
        },
      }
    );
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Register</Text>
      <View style={styles.formContainer}>
        <AppForm<RegisterFormValues>
          initialValues={{ name: '', email: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField<RegisterFormValues>
            autoCapitalize="words"
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Name"
            textContentType="name"
          />
          <AppFormField<RegisterFormValues>
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <PasswordInput<RegisterFormValues> name="password" placeholder="Password" />
          <SubmitButton<RegisterFormValues> 
            title={registerMutation.isPending ? 'Registering...' : 'Register'} 
            style={styles.registerButton}
            disabled={registerMutation.isPending}
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
  registerButton: {
    marginTop: 30,
  },
  formContainer: {
    width: '100%',
    top: 15,
  },
  tagline: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 40,
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});
