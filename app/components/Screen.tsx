import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import Loading from './Loading';

type Props = PropsWithChildren & {
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Screen({ children, isLoading = false, style }: Props) {
  return (
    <View style={[styles.screen, style]}>
      {isLoading ? <Loading /> : <View style={[styles.view, style]}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: {
    flex: 1,
  },
});
