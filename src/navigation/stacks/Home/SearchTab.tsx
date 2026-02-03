import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { Screen, SearchTabParamList } from '@/types';
import SmallLogo from '@/assets/imgs/small_logo.svg';
import { screenOptions } from '@/navigation/stacks/screenOptions';
import AccountButton from '@/components/AccountButton';
import SearchScreen from '@/screens/Home/SearchScreen';

const Search_Tab = createNativeStackNavigator<SearchTabParamList>();

const screens: Array<Screen<SearchTabParamList>> = [
  {
    name: 'Search',
    component: SearchScreen,
    options: ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: AccountButton,
    }),
  },
];

export default function SearchTab() {
  return (
    <Search_Tab.Navigator screenOptions={screenOptions}>
      {screens.map((screen) => (
        <Search_Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options ?? {}}
        />
      ))}
    </Search_Tab.Navigator>
  );
}
