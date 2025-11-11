import { StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';

import Screen from '../components/Screen';
import { AppForm, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import PasswordInput from '../components/forms/PasswordInput';
import { showErrorToast } from '../config/helperFunctions';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    )
    .label('Password'),
});

type PasswordResetFormValues = {
  password: string;
};

const handleSubmit = async (values: PasswordResetFormValues, navigate: (path: string) => void) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('https://uncaged-server.herokuapp.com/api/users/changePassword', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
      },
      body: JSON.stringify({
        password: values.password,
      }),
    });

    const body = await response.text();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      navigate('/home');
    }
  } catch (err) {
    console.log(err);
  }
};

export default function PasswordResetScreen() {
  const navigate = useNavigate();

  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>New password</Text>
      <View style={styles.formContainer}>
        <AppForm<PasswordResetFormValues>
          initialValues={{ password: '' }}
          onSubmit={(values) => handleSubmit(values, navigate)}
          validationSchema={validationSchema}
        >
          <PasswordInput<PasswordResetFormValues> name="password" placeholder="Password" />
          <SubmitButton<PasswordResetFormValues> title="Submit" style={styles.submitButton} />
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
