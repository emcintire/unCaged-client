import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Yup from 'yup';

import Screen from '../../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../../components/forms';
import colors from '../../config/colors';
import { showErrorToast } from '../../config/helperFunctions';
import type { WelcomeStackParamList } from '../../types';
import { useCheckCode } from '../../api/controllers/users.controller';

const validationSchema = Yup.object().shape({
  code: Yup.string().required().label('Code'),
});

type EmailCodeFormValues = {
  code: string;
};

export default function EmailCodeScreen() {
  const checkCodeMutation = useCheckCode();
  const { navigate } = useNavigation<NativeStackNavigationProp<WelcomeStackParamList>>();

  const handleSubmit = async (values: EmailCodeFormValues) => {
    try {
      await checkCodeMutation.mutateAsync({
        code: values.code,
      });
      navigate('Password Reset');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid code';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Check Email</Text>
      <Text style={styles.subTitle}>(Check spam folder)</Text>
      <View style={styles.formContainer}>
        <AppForm<EmailCodeFormValues>
          initialValues={{ code: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <AppFormField<EmailCodeFormValues>
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="code"
            placeholder="Enter Code                                  "
          />
          <SubmitButton<EmailCodeFormValues> title="Submit" style={styles.submitButton} />
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
    color: colors.white,
    alignSelf: 'center',
  },
  subTitle: {
    fontFamily: 'Montserrat-Medium',
    fontSize: 12,
    color: colors.light,
    alignSelf: 'center',
  },
});
