import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import type { ViewStyle, StyleProp } from 'react-native';
import { useFormikContext } from 'formik';
import type { FormikValues } from 'formik';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ErrorMessage } from '.';
import { borderRadius, colors, spacing, defaultStyles } from '@/config';

type Props<Values> = {
  name: keyof Values & string;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  width?: string | number;
  style?: StyleProp<ViewStyle>;
};

export default function PasswordInput<Values extends FormikValues>({ name, ...otherProps }: Props<Values>) {
  const { setFieldTouched, handleChange, errors, touched } = useFormikContext<Values>();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="lock"
          size={20}
          color={colors.medium}
          style={styles.icon}
        />
        <TextInput
          {...otherProps}
          placeholderTextColor={colors.medium}
          style={[defaultStyles.text, styles.input]}
          onBlur={() => setFieldTouched(name)}
          onChangeText={handleChange(name)}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity style={styles.button} onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons
            name="eye"
            size={20}
            color={colors.medium}
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
    alignItems: 'center',
    backgroundColor: colors.light,
    borderRadius: borderRadius.round,
    flexDirection: 'row',
    marginVertical: spacing.sm,
    padding: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    maxWidth: '82%',
    width: '82%',
  },
  button: {
    backgroundColor: 'transparent',
  },
});
