import { StyleSheet, Text, View } from 'react-native';
import Icon from '../components/Icon';
import colors from './colors';

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
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  errorContainer: {
    minHeight: 60,
    height: 'auto',
    width: '90%',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.red,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 10,
  },
  notificationText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: colors.bg,
    paddingLeft: 10,
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
