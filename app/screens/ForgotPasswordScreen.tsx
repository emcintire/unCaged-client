import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import { showErrorToast } from '../config/helperFunctions';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WelcomeStackParamList } from '../types';
import { useForgotPassword } from '../api/controllers/users.controller';

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label('Email'),
});

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordScreen({
  navigation,
}: NativeStackScreenProps<WelcomeStackParamList, 'ForgotPassword'>) {
  const forgotPasswordMutation = useForgotPassword();

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await forgotPasswordMutation.mutateAsync({
        email: values.email.toLowerCase(),
      });
      navigation.navigate('EmailCode');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send reset email';
      showErrorToast(message);
    }
  };
  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Reset Password</Text>
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
    backgroundColor: colors.bg,
    height: '100%',
    width: '100%',
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
