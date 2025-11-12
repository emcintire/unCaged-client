import { StyleSheet } from 'react-native';
import AppText from '../AppText';

type Props = {
  error?: string | Array<string>;
  visible?: boolean;
};

export default function ErrorMessage({ error, visible }: Props) {
  if (!visible || !error) return null;

  return <AppText style={styles.error}>{error}</AppText>;
}

const styles = StyleSheet.create({
  error: {
    fontSize: 14,
    paddingLeft: 10,
    color: '#ff4949',
  },
});
