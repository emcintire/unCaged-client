import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { useFormikContext } from 'formik';
import type { FormikValues } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ErrorMessage } from '.';
import defaultStyles from '../../config/styles';

type Props<T> = {
  name: keyof T & string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  width?: string | number;
  style?: StyleProp<ViewStyle>;
};

export default function PasswordInput<T extends FormikValues>({ name, ...otherProps }: Props<T>) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext<T>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View style={styles.container}>
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
        <TouchableOpacity style={styles.button} onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name="eye"
            size={20}
            color={defaultStyles.colors.medium}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <ErrorMessage error={errors[name] as string} visible={touched[name] as boolean} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: 'transparent',
  },
});
