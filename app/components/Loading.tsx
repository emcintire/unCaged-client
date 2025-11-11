import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../config/colors';

type Props = {
  visible?: boolean;
};

export default function Loading({ visible = true }: Props) {
  if (!visible) { return null; }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    marginTop: 20,
  },
});
