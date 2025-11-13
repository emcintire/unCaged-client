import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import type { ColorKey } from '../types';
import type { StyleProp, ViewStyle } from 'react-native';
import { borderRadius, spacing, fontSize, fontFamily } from '../config/theme';

type Props = {
  color?: ColorKey;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  title: string;
};

export default function AppButton({ style, title, onPress, color = 'orange' }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors[color] }, style]}
      onPress={onPress}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.orangeBg,
    borderRadius: borderRadius.round,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    width: '100%',
    marginVertical: spacing.sm,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.lg,
    textTransform: 'uppercase',
    fontFamily: fontFamily.extraBold,
  },
});
