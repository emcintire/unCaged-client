import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import { showErrorToast } from '../config/helperFunctions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WelcomeStackParamList } from '../types';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

type ForgotPasswordFormValues = {
  email: string;
};

const handleSubmit = async (
  values: ForgotPasswordFormValues,
  navigation: NativeStackScreenProps<WelcomeStackParamList, 'ForgotPassword'>['navigation']
) => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/forgotPassword', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: values.email.toLowerCase(),
    }),
  });

  const body = await response.text();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    await AsyncStorage.setItem('token', body);
    navigation.navigate('EmailCode');
  }
};

export default function ForgotPasswordScreen({
  navigation,
}: NativeStackScreenProps<WelcomeStackParamList, 'ForgotPassword'>) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Reset Password</Text>
      <View style={styles.formContainer}>
        <AppForm<ForgotPasswordFormValues>
          initialValues={{ email: '' }}
          onSubmit={(values) => handleSubmit(values, navigation)}
          validationSchema={validationSchema}
        >
          <AppFormField<ForgotPasswordFormValues>
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email                                  "
            textContentType="emailAddress"
          />
          <SubmitButton<ForgotPasswordFormValues> title="Submit" style={styles.submitButton} />
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
  submitButton: {
    marginTop: 30,
  },
  formContainer: {
    width: '100%',
    top: 15,
  },
  tagline: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 30,
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});
