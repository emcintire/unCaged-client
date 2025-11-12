import React, { ComponentType } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions, NativeStackScreenProps } from '@react-navigation/native-stack';
import { map } from 'lodash';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import AccountScreen from '../../screens/AccountScreen';
import FavoritesScreen from '../../screens/FavoritesScreen';
import SeenScreen from '../../screens/SeenScreen';
import AccountDetailsScreen from '../../screens/AccountDetailsScreen';
import SecurityScreen from '../../screens/SecurityScreen';
import AboutScreen from '../../screens/AboutScreen';
import RatingsScreen from '../../screens/RatingsScreen';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicy';
import { SettingsTabParamList, type HomeStackParamList } from '../../types/homeStackParamList';
import { useCurrentUser } from '../../api/controllers/users.controller';
import { screenOptions } from './screenOptions';

const imgStyle = {
  borderRadius: 17.5,
  height: 35,
  width: 35,
};

const sharedOptions = {
  headerTitleAlign: 'center',
  headerTitleStyle: { fontFamily: 'Montserrat-Bold', fontSize: 20 },
} as const;

const SettingsStackNavigator = createNativeStackNavigator<SettingsTabParamList>();

type Props = {
  navigation: NativeStackScreenProps<HomeStackParamList, 'SettingsTab'>['navigation'];
};

const screens: Array<{
  name: keyof SettingsTabParamList;
  component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  options: (props: Props & { userImage: string; refetch: () => void }) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Settings',
    component: AccountScreen,
    options: ({ navigation, userImage, refetch }) => ({
      headerLeft: () => <SmallLogo width={80} height={20} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            refetch();
            navigation.navigate('SettingsTab');
          }}
        >
          <Image source={{ uri: userImage }} style={imgStyle} />
        </TouchableOpacity>
      ),
      ...sharedOptions,
    }),
  },
  {
    name: 'My Account',
    component: AccountDetailsScreen,
    options: () => ({ ...sharedOptions }),
  },
  {
    name: 'Favorites',
    component: FavoritesScreen,
    options: ({ userImage }) => ({
      headerRight: () => <Image source={{ uri: userImage }} style={imgStyle} />,
      ...sharedOptions,
    }),
  },
  {
    name: 'Seen',
    component: SeenScreen,
    options: ({ userImage }) => ({
      headerRight: () => <Image source={{ uri: userImage }} style={imgStyle} />,
      ...sharedOptions,
    }),
  },
  {
    name: 'Ratings',
    component: RatingsScreen,
    options: ({ userImage }) => ({
      headerRight: () => <Image source={{ uri: userImage }} style={imgStyle} />,
      ...sharedOptions,
    }),
  },
  {
    name: 'Security',
    component: SecurityScreen,
    options: ({ userImage }) => ({
      headerRight: () => <Image source={{ uri: userImage }} style={imgStyle} />,
      ...sharedOptions,
    }),
  },
  {
    name: 'About',
    component: AboutScreen,
    options: () => ({ ...sharedOptions }),
  },
  {
    name: 'Privacy Policy',
    component: PrivacyPolicyScreen,
    options: () => ({ ...sharedOptions }),
  },
];

export default function SettingsStackScreen({ navigation }: Props) {
  const { data: user, refetch } = useCurrentUser();
  const userImage = user?.img || '';

  return (
    <SettingsStackNavigator.Navigator screenOptions={screenOptions}>
      {map(screens, (screen) => (
        <SettingsStackNavigator.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={screen.options({ navigation, userImage, refetch })}
        />
      ))}
    </SettingsStackNavigator.Navigator>
  );
}
