import { useFormikContext, FormikValues } from 'formik';
import type { DimensionValue, TextInputProps } from 'react-native';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';

type Props<T> = Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur'> & {
  icon?: keyof typeof MaterialCommunityIconsType.glyphMap;
  name: keyof T & string;
  width?: DimensionValue;
};

export default function AppFormField<T extends FormikValues>({ name, width, ...otherProps }: Props<T>) {
  const { setFieldTouched, handleChange, errors, touched, values } = useFormikContext<T>();

  return (
    <>
      <AppTextInput
        onBlur={() => setFieldTouched(name)}
        onChangeText={handleChange(name)}
        width={width ?? null}
        value={values[name] as string}
        {...otherProps}
      />
      <ErrorMessage
        error={errors[name] as string}
        visible={touched[name] as boolean}
      />
    </>
  );
}
