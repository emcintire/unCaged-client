import { View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import Loading from './Loading';
import { colors } from '@/config';

type Props = PropsWithChildren & {
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Screen({ children, isLoading = false, style }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.bg,
          flex: 1,
          height: '100%',
          paddingBottom: 0,
          paddingTop: 0,
          width: '100%',
        },
        style,
      ]}
    >
      {isLoading ? <Loading /> : children}
    </View>
  );
}
