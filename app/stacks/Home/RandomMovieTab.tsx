import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { map } from 'lodash';
import type { RandomTabParamList, Screen } from '../../types';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import { screenOptions } from '../screenOptions';
import AccountButton from '../../components/AccountButton';
import RandomMovieScreen from '../../screens/Home/RandomMovieScreen';

const Random_Movie_Tab = createNativeStackNavigator<RandomTabParamList>();

const screens: Array<Screen<RandomTabParamList>> = [
  {
    name: 'Random',
    component: RandomMovieScreen,
    options: ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: AccountButton,
    }),
  },
];

export default function RandomMovieTab() {
  return (
    <Random_Movie_Tab.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <Random_Movie_Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options ?? {}}
        />
      ))}
    </Random_Movie_Tab.Navigator>
  );
}
