import { StyleSheet, View } from 'react-native';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useForgotPassword } from '../../api/controllers/users.controller';
import { showErrorToast, showSuccessToast } from '../../config/helperFunctions';
import type { WelcomeStackParamList } from '../../types';
import { AppForm, AppFormField, SubmitButton } from '../../components/forms';
import Screen from '../../components/Screen';
import { toLower, trim } from 'lodash';

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
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
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
          <SubmitButton<ForgotPasswordFormValues> title="Submit" style={styles.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  submitButton: { marginTop: 30 },
  formContainer: { width: '100%', top: 15 },
});
