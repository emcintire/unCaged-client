import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import colors from '../config/colors';
import type { ColorKey } from '../types/Colors';
import type { StyleProp, ViewStyle } from 'react-native';

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
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    fontSize: 18,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-ExtraBold',
  },
});
