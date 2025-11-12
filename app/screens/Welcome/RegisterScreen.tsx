import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';

import Screen from '../../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../../components/forms';
import PasswordInput from '../../components/forms/PasswordInput';
import { showErrorToast } from '../../config/helperFunctions';
import { useRegister } from '../../api/controllers/users.controller';

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

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const handleSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }

    try {
      await registerMutation.mutateAsync({
        name: values.name,
        email: values.email.toLowerCase(),
        password: values.password,
      });
      navigate('/home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
        <AppForm<RegisterFormValues>
          initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField<RegisterFormValues>
            autoCapitalize="none"
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
          <PasswordInput<RegisterFormValues>
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          <SubmitButton<RegisterFormValues> title="Register" style={styles.registerButton} />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
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
});
