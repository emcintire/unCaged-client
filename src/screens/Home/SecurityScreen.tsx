import * as Yup from 'yup';
import { StyleSheet, View } from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import type { HomeStackParamList } from '@/types';
import { form, spacing, showErrorToast, showSuccessToast } from '@/config';
import { useChangePassword } from '@/services';
import { AppForm, SubmitButton } from '@/components/forms';
import Screen from '@/components/Screen';
import PasswordInput from '@/components/forms/PasswordInput';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from '@/constants';

type SecurityFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function SecurityScreen() {
  const { navigate } = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (values: SecurityFormValues) => {
    if (values.newPassword !== values.confirmPassword) {
      return showErrorToast('Passwords do not match');
    }

    if (values.newPassword === values.currentPassword) {
      return showErrorToast('New password must be different from current password');
    }

    try {
      await changePasswordMutation.mutateAsync({
        password: values.newPassword,
      });
      showSuccessToast('Password updated!');
      navigate('SettingsTab');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.formContainer}>
        <AppForm<SecurityFormValues>
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <View style={{ marginBottom: 20 }}>
            <PasswordInput<SecurityFormValues>
              name="currentPassword"
              placeholder="Current Password"
            />
          </View>
          <PasswordInput<SecurityFormValues> name="newPassword" placeholder="New Password" />
          <PasswordInput<SecurityFormValues>
            name="confirmPassword"
            placeholder="Confirm New Password"
          />
          <SubmitButton<SecurityFormValues> title="Submit" style={styles.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  scrollContainer: {
    height: '100%',
    width: '100%',
  },
  formContainer: form.container,
  submitButton: form.submitButton,
});

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required().label('Password'),
  newPassword: Yup.string()
    .required()
    .label('New Password')
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
  confirmPassword: Yup.string()
    .required()
    .label('Confirm Password')
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});
