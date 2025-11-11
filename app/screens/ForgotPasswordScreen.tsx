import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigate } from 'react-router-native';

import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import { showErrorToast } from '../config/helperFunctions';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

type ForgotPasswordFormValues = {
  email: string;
};

const handleSubmit = async (
  values: ForgotPasswordFormValues,
  navigate: (route: string) => void
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
    navigate('/emailCode');
  }
};

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  
  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Reset Password</Text>
      <View style={styles.formContainer}>
        <AppForm<ForgotPasswordFormValues>
          initialValues={{ email: '' }}
          onSubmit={(values) => handleSubmit(values, navigate)}
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
