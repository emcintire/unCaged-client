import { useFormikContext } from 'formik';
import type { FormikValues } from 'formik';
import AppButton from '../AppButton';
import type { ColorKey } from '../../types/Colors';
import type { StyleProp, ViewStyle } from 'react-native';

type Props = {
  color?: ColorKey;
  style?: StyleProp<ViewStyle>;
  title: string;
};

export default function SubmitButton<T extends FormikValues>({ color = 'orange', style, title }: Props) {
  const { handleSubmit } = useFormikContext<T>();

  return <AppButton title={title} onPress={handleSubmit} color={color} style={style} />;
}
