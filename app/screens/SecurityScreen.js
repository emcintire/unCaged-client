import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import { AppForm, SubmitButton } from '../components/forms';
import PasswordInput from '../components/PasswordInput';
import colors from '../config/colors';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';

const handleSubmit = async (values, props) => {
  if (values.newPassword !== values.confirmPassword)
    return showErrorToast('Passwords do not match');

  if (values.newPassword === values.currentPassword)
    return showErrorToast('New password must be different from current password');

  AsyncStorage.getItem('token')
    .then(async (token) => {
      let response = await fetch(
        'https://uncaged-server.herokuapp.com/api/users/changePassword',
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
          body: JSON.stringify({
            currentPassword: values.currentPassword,
            password: values.newPassword,
          }),
        }
      );

      const body = await response.text();

      if (response.status !== 200) {
        showErrorToast(body);
      } else {
        showSuccessToast('Password updated!');
        props.navigation.navigate('Settings');
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

function SecurityScreen(props) {
  return (
    <Screen style={styles.container}>
      <Text style={styles.tagline}>Change Password</Text>
      <View style={styles.formContainer}>
        <AppForm
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          onSubmit={(values) => handleSubmit(values, props)}
          validationSchema={validationSchema}
        >
          <View style={{ marginBottom: 20 }}>
            <PasswordInput
              name="currentPassword"
              placeholder="Current Password"
            />
          </View>
          <PasswordInput
            name="newPassword"
            placeholder="New Password"
          />
          <PasswordInput
            name="confirmPassword"
            placeholder="Confirm New Password"
          />
          <SubmitButton title="Submit" style={styles.submitButton} />
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
  currentPassword: Yup.string()
    .required()
    .label('Password'),
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
