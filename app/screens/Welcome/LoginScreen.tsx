import { View } from 'react-native';
import * as Yup from 'yup';
import Screen from '../../components/Screen';
import { showErrorToast, showSuccessToast } from '../../config/helperFunctions';
import { AppForm, AppFormField, PasswordInput, SubmitButton } from '../../components/forms';
import { useLogin } from '../../api';
import { form, screen } from '../../config/theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().label('Password'),
});

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginScreen() {
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const loginMutation = useLogin();

  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    loginMutation.mutate({
      email: values.email.toLowerCase(),
      password: values.password,
    }, {
      onSuccess: () => {
        showSuccessToast('Login successful!');
        navigate('Home');
      },
      onError: (error) => {
        showErrorToast(error instanceof Error ? error.message : 'Login failed');
      },
    });
  };

  return (
    <Screen style={screen.withPadding}>
      <View style={form.container}>
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
          <SubmitButton<LoginFormValues> title="Login" style={form.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}
