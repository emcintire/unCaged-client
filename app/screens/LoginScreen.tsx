import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';
import Screen from '../components/Screen';
import colors from '../config/colors';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';
import { AppForm, AppFormField, PasswordInput, SubmitButton } from '../components/forms';
import { useLogin } from '../api';

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
  const loginMutation = useLogin();

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    loginMutation.mutate({
      email: values.email.toLowerCase(),
      password: values.password,
    }, {
      onSuccess: () => {
        showSuccessToast('Login successful!');
        navigate('/home');
      },
      onError: (error) => {
        showErrorToast(error instanceof Error ? error.message : 'Login failed');
      },
    });
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
