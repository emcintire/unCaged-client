import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import Loading from './Loading';
import colors from '../config/colors';

type Props = PropsWithChildren & {
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Screen({ children, isLoading = false, style }: Props) {
  return (
    <View style={[styles.screen, style]}>
      {isLoading ? <Loading /> : children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
    flex: 1,
    height: '100%',
    paddingBottom: 0,
    paddingTop: 0,
    width: '100%',
  },
});
