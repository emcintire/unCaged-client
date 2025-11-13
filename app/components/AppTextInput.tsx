import { View, TextInput, StyleSheet } from 'react-native';
import type { TextInputProps, DimensionValue } from 'react-native';
import {
  MaterialCommunityIcons, type MaterialCommunityIcons as MaterialCommunityIconsType,
} from '@expo/vector-icons';
import defaultStyles from '../config/styles';
import { borderRadius, spacing } from '../config/theme';

type Props = TextInputProps & {
  icon?: keyof typeof MaterialCommunityIconsType.glyphMap | undefined;
  width?: DimensionValue;
};

export default function AppTextInput({ icon, width = '100%', style, ...otherProps }: Props) {
  return (
    <View style={[styles.container, { width }, style]}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={defaultStyles.colors.medium}
          style={styles.icon}
        />
      )}
      <TextInput
        placeholderTextColor={defaultStyles.colors.medium}
        style={[defaultStyles.text, styles.input]}
        {...otherProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: defaultStyles.colors.light,
    borderRadius: borderRadius.round,
    flexDirection: 'row',
    marginVertical: spacing.sm,
    padding: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    width: '90%',
  },
});
