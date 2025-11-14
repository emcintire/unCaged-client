import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Yup from 'yup';
import { toLower, trim } from 'lodash';
import type { RootStackParamList } from '@/types';
import { useRegister } from '@/services';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from '@/constants';
import { form, screen, showErrorToast } from '@/config';
import Screen from '@/components/Screen';
import { AppForm, AppFormField, SubmitButton } from '@/components/forms';
import PasswordInput from '@/components/forms/PasswordInput';

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label('Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string()
    .required()
    .label('Password')
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
  confirmPassword: Yup.string()
    .required()
    .label('Password')
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});

type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterScreen() {
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const registerMutation = useRegister();

  const handleSubmit = async (values: RegisterFormValues) => {
    if (values.password !== values.confirmPassword) {
      showErrorToast('Passwords do not match');
      return;
    }

    try {
      const email = toLower(trim(values.email));
      await registerMutation.mutateAsync({
        name: values.name,
        email,
        password: values.password,
      });
      navigate('Home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={screen.withPadding}>
      <View style={form.container}>
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
          <SubmitButton<RegisterFormValues> title="Register" style={form.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}
