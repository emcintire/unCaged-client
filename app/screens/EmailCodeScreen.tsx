import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Screen from '../components/Screen';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import colors from '../config/colors';
import { showErrorToast } from '../config/helperFunctions';
import type { WelcomeStackParamList } from '../types';

const validationSchema = Yup.object().shape({
  code: Yup.string().required().label('Code'),
});

type EmailCodeFormValues = {
  code: string;
};

export default function EmailCodeScreen({
  navigation,
}: NativeStackScreenProps<WelcomeStackParamList, 'EmailCode'>) {
  const handleSubmit = async (values: EmailCodeFormValues) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch('https://uncaged-server.herokuapp.com/api/users/checkCode', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': token || '',
        },
        body: JSON.stringify({
          code: values.code,
        }),
      });

      const body = await response.text();

      if (response.status !== 200) {
        showErrorToast(body);
      } else {
        navigation.navigate('PasswordReset');
      }
    } catch (err) {
      console.log(err);
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
