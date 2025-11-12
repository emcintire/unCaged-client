import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-native';

import Screen from '../../components/Screen';
import { AppForm, SubmitButton } from '../../components/forms';
import PasswordInput from '../../components/forms/PasswordInput';
import { showErrorToast } from '../../config/helperFunctions';
import { useChangePassword } from '../../api/controllers/users.controller';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .matches(
      /^.*(?=.{8,})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      'Must contain 8 characters, 1 uppercase, and 1 number'
    )
    .label('Password'),
});

type PasswordResetFormValues = {
  password: string;
};

export default function PasswordResetScreen() {
  const navigate = useNavigate();
  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (values: PasswordResetFormValues) => {
    try {
      await changePasswordMutation.mutateAsync({ password: values.password });
      navigate('/home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>New password</Text>
      <View style={styles.formContainer}>
        <AppForm<PasswordResetFormValues>
          initialValues={{ password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <PasswordInput<PasswordResetFormValues> name="password" placeholder="Password" />
          <SubmitButton<PasswordResetFormValues> title="Submit" style={styles.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
  },
  submitButton: {
    marginTop: 30,
  },
  formContainer: {
    width: '100%',
    top: 15,
  },
  tagline: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 30,
    marginTop: 10,
    color: 'white',
    alignSelf: 'center',
  },
});
