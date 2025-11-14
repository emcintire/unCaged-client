import { View } from 'react-native';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toLower, trim } from 'lodash';
import type { WelcomeStackParamList } from '@/types';
import { useForgotPassword } from '@/services';
import { showErrorToast, showSuccessToast, form, screen } from '@/config';
import { AppForm, AppFormField, SubmitButton } from '@/components/forms';
import Screen from '@/components/Screen';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordScreen() {
  const forgotPasswordMutation = useForgotPassword();
  const { navigate } = useNavigation<NativeStackNavigationProp<WelcomeStackParamList>>();

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      const email = toLower(trim(values.email));
      await forgotPasswordMutation.mutateAsync({ email });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      showErrorToast(message);
    } finally {
      showSuccessToast('If you have an account, a reset code has been sent to your email.');
      navigate('Email Code');
    }
  };

  return (
    <Screen style={screen.withPadding}>
      <View style={form.container}>
        <AppForm<ForgotPasswordFormValues>
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
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
          <SubmitButton<ForgotPasswordFormValues> title="Submit" style={form.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}
