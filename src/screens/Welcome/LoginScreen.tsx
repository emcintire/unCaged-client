import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';
import { toLower, trim } from 'lodash';
import type { RootStackParamList } from '@/types';
import { form, screen, showErrorToast, showSuccessToast } from '@/config';
import { useLogin } from '@/services';
import { AppForm, AppFormField, PasswordInput, SubmitButton } from '@/components/forms';
import Screen from '@/components/Screen';
 
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
    const email = toLower(trim(values.email));
    loginMutation.mutate({
      email,
      password: values.password,
    }, {
      onSuccess: () => {
        showSuccessToast('Login successful!');
        navigate('Home');
      },
      onError: () => {
        showErrorToast('Login failed');
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
