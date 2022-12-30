import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useFormikContext } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { ErrorMessage } from './forms';
import defaultStyles from '../config/styles';

function PasswordInput({ name, ...otherProps }) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext();

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View style={[styles.conatiner, { width: '100%' }]}>
        <MaterialCommunityIcons
          name="lock"
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
        <TextInput
          {...otherProps}
          placeholderTextColor={defaultStyles.colors.medium}
          style={[defaultStyles.text, styles.input]}
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleChange(name)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name="eye"
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}
const styles = StyleSheet.create({
  conatiner: {
    backgroundColor: defaultStyles.colors.light,
    borderRadius: 25,
    flexDirection: 'row',
    padding: 15,
    marginVertical: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    maxWidth: '82%',
    width: '82%',
  },
  button: {
    // position: 'absolute',
    // right: 0,
    // top: 17,
    backgroundColor: 'transparent',
  },
})

export default PasswordInput;