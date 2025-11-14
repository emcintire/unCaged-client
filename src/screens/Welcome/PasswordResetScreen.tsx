import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import * as Yup from 'yup';

import type { RootStackParamList } from '@/types';
import { useChangePassword } from '@/services';
import { PASSWORD_ERROR_MESSAGE, PASSWORD_REGEX } from '@/constants';
import { form, screen, typography, utils, showErrorToast } from '@/config';
import { AppForm, SubmitButton } from '@/components/forms';
import PasswordInput from '@/components/forms/PasswordInput';
import Screen from '@/components/Screen';

const validationSchema = Yup.object().shape({
  password: Yup.string()
    .required()
    .matches(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE)
    .label('Password'),
});

type PasswordResetFormValues = {
  password: string;
};

export default function PasswordResetScreen() {
  const { navigate } = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const changePasswordMutation = useChangePassword();

  const handleSubmit = async (values: PasswordResetFormValues) => {
    try {
      await changePasswordMutation.mutateAsync({ password: values.password });
      navigate('Home');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to reset password';
      showErrorToast(message);
    }
  };

  return (
    <Screen style={screen.withPadding}>
      <Text style={[typography.h1, utils.selfCenter]}>New password</Text>
      <View style={form.container}>
        <AppForm<PasswordResetFormValues>
          initialValues={{ password: '' }}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <PasswordInput<PasswordResetFormValues> name="password" placeholder="Password" />
          <SubmitButton<PasswordResetFormValues> title="Submit" style={form.submitButton} />
        </AppForm>
      </View>
    </Screen>
  );
}
