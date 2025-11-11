export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  EmailCode: { email: string };
  PasswordReset: { email: string; code: string };
};
