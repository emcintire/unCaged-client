import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import { AppForm, SubmitButton } from '../components/forms';
import PasswordInput from '../components/forms/PasswordInput';
import colors from '../config/colors';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';
import { useChangePassword } from '../api/controllers/users.controller';

type SecurityFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function SecurityScreen({ navigation }: { navigation: { navigate: (route: string) => void } }) {
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
      navigation.navigate('Settings');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      showErrorToast(message);
    }
  };
  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Change Password</Text>
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
    padding: 15,
    backgroundColor: colors.bg,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    paddingTop: 5,
  },
  scrollContainer: {
    height: '100%',
    width: '100%',
  },
  formContainer: {
    width: '100%',
    top: 15,
  },
  submitButton: {
    marginTop: 30,
  },
  tagline: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 25,
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required().label('Password'),
  newPassword: Yup.string()
    .required()
    .label('New Password')
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    ),
  confirmPassword: Yup.string()
    .required()
    .label('Confirm Password')
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    ),
});

export default SecurityScreen;
