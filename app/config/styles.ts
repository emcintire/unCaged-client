import { Platform, TextStyle } from 'react-native';
import colors from './colors';

type DefaultStyles = {
  colors: typeof colors;
  text: TextStyle;
};

const defaultStyles: DefaultStyles = {
  colors,
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
};

export default defaultStyles;
