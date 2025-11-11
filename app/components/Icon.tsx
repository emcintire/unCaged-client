import { View, TouchableOpacity } from 'react-native';
import {
  MaterialCommunityIcons, type MaterialCommunityIcons as MaterialCommunityIconsType,
} from '@expo/vector-icons';
import type { StyleProp, ViewStyle } from 'react-native';
import colors from '../config/colors';

type Props = {
  backgroundColor?: string;
  iconColor?: string;
  name: keyof typeof MaterialCommunityIconsType.glyphMap;
  onPress?: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export default function Icon({
  backgroundColor = colors.black,
  iconColor = colors.white,
  name,
  onPress,
  size = 40,
  style,
}: Props) {
  const content = (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <MaterialCommunityIcons name={name} color={iconColor} size={size * 0.5} />
    </View>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}
