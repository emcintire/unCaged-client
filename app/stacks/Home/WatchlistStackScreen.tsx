import React, { ComponentType } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import { map } from 'lodash';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import WatchlistScreen from '../../screens/Home/WatchlistScreen';
import { WatchlistTabParamList, type HomeStackParamList } from '../../types';
import { useCurrentUser } from '../../api/controllers/users.controller';
import { screenOptions } from './screenOptions';

const WatchlistStackNavigator = createNativeStackNavigator<WatchlistTabParamList>();

type Props = {
  navigation: NativeStackScreenProps<HomeStackParamList, 'WatchlistTab'>['navigation'];
};

const screens: Array<{
  name: keyof WatchlistTabParamList;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  options: (props: Props & { userImage: string; refetch: () => void }) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Watchlist',
    component: WatchlistScreen,
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
        fontSize: 20,
      },
    }),
  },
];

export default function WatchlistStackScreen({ navigation }: Props) {
  const { data: user, refetch } = useCurrentUser();
  const userImage = user?.img || '';

  return (
    <WatchlistStackNavigator.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <WatchlistStackNavigator.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options({ navigation, userImage, refetch })}
        />
      ))}
    </WatchlistStackNavigator.Navigator>
  );
}
