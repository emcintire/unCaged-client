import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SmallLogo from '@/assets/imgs/small_logo.svg';
import type { HomeTabParamList, Screen } from '@/types';
import { screenOptions } from '@/navigation/stacks/screenOptions';
import AccountButton from '@/components/AccountButton';
import HomeScreen from '@/screens/Home/HomeScreen';

const Home_Tab = createNativeStackNavigator<HomeTabParamList>();

const screens: Array<Screen<HomeTabParamList>> = [
  {
    name: 'Home',
    component: HomeScreen,
    options: ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: AccountButton,
    }),
  },
];

export default function HomeStackScreen() {
  return (
    <Home_Tab.Navigator screenOptions={screenOptions}>
      {screens.map((screen) => (
        <Home_Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options ?? {}}
        />
      ))}
    </Home_Tab.Navigator>
  );
}
