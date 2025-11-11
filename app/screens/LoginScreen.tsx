import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { showErrorToast } from '../config/helperFunctions';
import { AppForm, AppFormField, PasswordInput, SubmitButton } from '../components/forms';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().label('Password'),
});

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const navigate = useNavigate();

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    const response = await fetch('https://uncaged-server.herokuapp.com/api/users/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email.toLowerCase(),
        password: values.password,
      }),
    });

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
      <Text style={styles.tagline}>Login</Text>
      <View style={styles.formContainer}>
        <AppForm<LoginFormValues>
          initialValues={{ email: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField<LoginFormValues>
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <PasswordInput<LoginFormValues> name="password" placeholder="Password" />
          <SubmitButton<LoginFormValues> title="Login" style={styles.loginButton} />
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
  loginButton: {
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
