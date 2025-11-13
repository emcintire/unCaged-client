import AppText from '../AppText';
import { typography } from '../../config/theme';

type Props = {
  error?: string | Array<string>;
  visible?: boolean;
};

export default function ErrorMessage({ error, visible }: Props) {
  if (!visible || !error) return null;

  return <AppText style={typography.error}>{error}</AppText>;
}
