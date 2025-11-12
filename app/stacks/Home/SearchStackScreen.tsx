import React, { ComponentType } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import { map } from 'lodash';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import SearchScreen from '../../screens/Home/SearchScreen';
import { useCurrentUser } from '../../api/controllers/users.controller';
import { SearchTabParamList, type HomeStackParamList } from '../../types';
import { screenOptions } from './screenOptions';

const SearchStackNavigator = createNativeStackNavigator<SearchTabParamList>();

type Props = {
  navigation: NativeStackScreenProps<HomeStackParamList, 'SearchTab'>['navigation'];
};

const screens: Array<{
  name: keyof SearchTabParamList;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  options: (props: Props & { userImage: string; refetch: () => void }) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Search',
    component: SearchScreen,
    options: ({ navigation, userImage, refetch }) => ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            refetch();
            navigation.navigate('SettingsTab');
          }}
        >
          <Image
            source={{ uri: userImage }}
            style={{
              width: 35,
              height: 35,
              borderRadius: 17.5,
            }}
          />
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 22,
      },
    }),
  },
];

export default function SearchStackScreen({ navigation }: Props) {
  const { data: user, refetch } = useCurrentUser();
  const userImage = user?.img || '';

  return (
    <SearchStackNavigator.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <SearchStackNavigator.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options({ navigation, userImage, refetch })}
        />
      ))}
    </SearchStackNavigator.Navigator>
  );
}
