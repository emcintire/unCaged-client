import React, { ComponentType } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import { map } from 'lodash';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import RandomMovieScreen from '../../screens/Home/RandomMovieScreen';
import { useCurrentUser } from '../../api/controllers/users.controller';
import type { HomeStackParamList } from '../../types';
import { screenOptions } from './screenOptions';

const RandomStackNavigator = createNativeStackNavigator();

type Props = {
  navigation: NativeStackScreenProps<HomeStackParamList, 'RandomTab'>['navigation'];
};

const screens: Array<{
  name: string;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  options: (props: Props & { userImage: string; refetch: () => void }) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Random',
    component: RandomMovieScreen,
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

export default function RandomMovieStackScreen({ navigation }: Props) {
  const { data: user, refetch } = useCurrentUser();
  const userImage = user?.img || '';

  return (
    <RandomStackNavigator.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <RandomStackNavigator.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options({ navigation, userImage, refetch })}
        />
      ))}
    </RandomStackNavigator.Navigator>
  );
}
