import { StyleSheet, View } from 'react-native';
import colors from '../config/colors';

type SeparatorProps = {
  modal?: boolean;
};

export default function Separator({ modal }: SeparatorProps) {
  return <View style={modal ? styles.modalSeparator : styles.separator} />;
}

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: colors.bg,
  },
  modalSeparator: {
    width: '100%',
    height: 1,
    backgroundColor: '#d8d8d8',
    marginTop: 15,
    marginBottom: 15,
  },
});
