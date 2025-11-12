import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { map } from 'lodash';
import type { Screen, WatchlistTabParamList } from '../../types';
import { screenOptions } from '../screenOptions';
import AccountButton from '../../components/AccountButton';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import WatchlistScreen from '../../screens/Home/WatchlistScreen';

const Watchlist_Tab = createNativeStackNavigator<WatchlistTabParamList>();

const screens: Array<Screen<WatchlistTabParamList>> = [
  {
    name: 'Watchlist',
    component: WatchlistScreen,
    options: ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: AccountButton,
    }),
  },
];

export default function WatchlistTab() {
  return (
    <Watchlist_Tab.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <Watchlist_Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options ?? {}}
        />
      ))}
    </Watchlist_Tab.Navigator>
  );
}
