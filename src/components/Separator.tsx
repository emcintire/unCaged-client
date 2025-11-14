import { View } from 'react-native';
import { colors } from '@/config';

type SeparatorProps = {
  modal?: boolean;
};

export default function Separator({ modal }: SeparatorProps) {
  return (
    <View
      style={{
        width: '100%',
        height: 1,
        backgroundColor: modal ? colors.light : colors.bg,
      }}
    />
  );
}
