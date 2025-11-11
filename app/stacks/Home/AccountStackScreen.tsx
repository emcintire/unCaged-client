import React, { ComponentType } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { map } from 'lodash';
import colors from '../../config/colors';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import AccountScreen from '../../screens/AccountScreen';
import FavoritesScreen from '../../screens/FavoritesScreen';
import SeenScreen from '../../screens/SeenScreen';
import AccountDetailsScreen from '../../screens/AccountDetailsScreen';
import SecurityScreen from '../../screens/SecurityScreen';
import AboutScreen from '../../screens/AboutScreen';
import RatingsScreen from '../../screens/RatingsScreen';
import PrivacyPolicyScreen from '../../screens/PrivacyPolicy';
import type { User } from '../../types';
import { SettingsTabParamList } from '../../types/homeStackParamList';

const Settings_Stack = createNativeStackNavigator<SettingsTabParamList>();

type Props = {
  navigation: { navigate: (route: string) => void };
  userImage: string;
  fetchData: (setUser: React.Dispatch<React.SetStateAction<User | null>>) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const screens: Array<{
  name: keyof SettingsTabParamList;
  component: ComponentType<any>;
  options: (props: Props) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Settings',
    component: AccountScreen,
    options: ({ navigation, userImage, fetchData, setUser }) => ({
      headerLeft: () => <SmallLogo width={100} height={20} />,
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            fetchData(setUser);
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
  {
    name: 'My Account',
    component: AccountDetailsScreen,
    options: () => ({
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'Favorites',
    component: FavoritesScreen,
    options: ({ userImage }) => ({
      headerRight: () => (
        <Image
          source={{ uri: userImage }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 17.5,
          }}
        />
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'Seen',
    component: SeenScreen,
    options: ({ userImage }) => ({
      headerRight: () => (
        <Image
          source={{ uri: userImage }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 17.5,
          }}
        />
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'Ratings',
    component: RatingsScreen,
    options: ({ userImage }) => ({
      headerRight: () => (
        <Image
          source={{ uri: userImage }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 17.5,
          }}
        />
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'Security',
    component: SecurityScreen,
    options: ({ userImage }) => ({
      headerRight: () => (
        <Image
          source={{ uri: userImage }}
          style={{
            width: 35,
            height: 35,
            borderRadius: 17.5,
          }}
        />
      ),
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'About',
    component: AboutScreen,
    options: () => ({
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
  {
    name: 'Privacy Policy',
    component: PrivacyPolicyScreen,
    options: () => ({
      headerTitleAlign: 'center',
      headerTitleStyle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
      },
    }),
  },
];

export default function AccountStackScreen({ navigation, userImage, fetchData, setUser }: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Settings_Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.black,
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      >
        {map(screens, (screen) => (
          <Settings_Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={screen.options({ navigation, userImage, fetchData, setUser })}
          />
        ))}
      </Settings_Stack.Navigator>
    </View>
  );
}
