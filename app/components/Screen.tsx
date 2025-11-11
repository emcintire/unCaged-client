import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import type { StyleProp, ViewStyle } from 'react-native';
import type { PropsWithChildren } from 'react';
import Loading from './Loading';

type Props = PropsWithChildren & {
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Screen({ children, isLoading = false, style }: Props) {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      {isLoading ? <Loading /> : <View style={[styles.view, style]}>{children}</View>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
  },
  view: {
    flex: 1,
  },
});
