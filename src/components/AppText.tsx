import { Text, type TextProps } from 'react-native';
import type { PropsWithChildren } from 'react';
import { defaultStyles } from '@/config';

export default function AppText({ children, style, ...otherProps }: TextProps & PropsWithChildren) {
  return (
    <Text style={[defaultStyles.text, style]} {...otherProps}>
      {children}
    </Text>
  );
}
