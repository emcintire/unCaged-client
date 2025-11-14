import { StyleSheet, Text, View } from 'react-native';
import Icon from '@/components/Icon';
import { colors } from './colors';
import { borderRadius, spacing, fontSize, fontFamily } from './theme';

type ToastConfigProps = {
  text1?: string;
  text2?: string;
};

const styles = StyleSheet.create({
  successContainer: {
    minHeight: 60,
    height: 'auto',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.green,
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: spacing.sm,
  },
  errorContainer: {
    minHeight: 60,
    height: 'auto',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: borderRadius.md,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: spacing.sm,
  },
  notificationText: {
    fontSize: fontSize.sm,
    fontFamily: fontFamily.medium,
    color: colors.bg,
    paddingLeft: spacing.sm,
    width: '88%',
  },
});

export const toastConfig = {
  success: ({ text1 }: ToastConfigProps) => (
    <View style={styles.successContainer}>
      <Icon
        name="check-bold"
        backgroundColor={colors.green}
        iconColor={colors.white}
        size={35}
      />
      <Text style={[styles.notificationText, { color: colors.green }]}>{text1}</Text>
    </View>
  ),
  error: ({ text1 }: ToastConfigProps) => (
    <View style={styles.errorContainer}>
      <Icon
        name="exclamation-thick"
        backgroundColor={colors.red}
        iconColor={colors.white}
        size={35}
      />
      <Text style={[styles.notificationText, { color: colors.red }]}>{text1}</Text>
    </View>
  ),
};
