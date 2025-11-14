import { StyleSheet, Text, TouchableOpacity, type StyleProp, type ViewStyle } from 'react-native';
import type { ColorKey } from '@/types';
import { borderRadius, colors, fontFamily, fontSize, spacing } from '@/config';

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
