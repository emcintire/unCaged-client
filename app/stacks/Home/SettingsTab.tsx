import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { map } from 'lodash';

import type { Screen, SettingsTabParamList } from '../../types';
import { screenOptions } from '../screenOptions';
import AboutScreen from '../../screens/Home/AboutScreen';
import AccountButton from '../../components/AccountButton';
import AccountDetailsScreen from '../../screens/Home/AccountDetailsScreen';
import FavoritesScreen from '../../screens/Home/FavoritesScreen';
import PrivacyPolicyScreen from '../../screens/Home/PrivacyPolicy';
import RatingsScreen from '../../screens/Home/RatingsScreen';
import SecurityScreen from '../../screens/Home/SecurityScreen';
import SeenScreen from '../../screens/Home/SeenScreen';
import SettingsScreen from '../../screens/Home/SettingsScreen';
import SmallLogo from '../../assets/imgs/small_logo.svg';

const Settings_Tab = createNativeStackNavigator<SettingsTabParamList>();

const screens: Array<Screen<SettingsTabParamList>> = [{
  name: 'Settings',
  component: SettingsScreen,
  options: ({
    headerLeft: () => <SmallLogo width={80} height={20} />,
    headerRight: AccountButton,
  }),
}, {
  name: 'My Account',
  component: AccountDetailsScreen,
}, {
  name: 'Favorites',
  component: FavoritesScreen,
}, {
  name: 'Seen',
  component: SeenScreen,
}, {
  name: 'Ratings',
  component: RatingsScreen,
}, {
  name: 'Security',
  component: SecurityScreen,
  options: ({ title: 'Change Password' }),
}, {
  name: 'About',
  component: AboutScreen,
}, {
  name: 'Privacy Policy',
  component: PrivacyPolicyScreen,
}];

export default function SettingsTab() {
  return (
    <Settings_Tab.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <Settings_Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options ?? {}}
        />
      ))}
    </Settings_Tab.Navigator>
  );
}
