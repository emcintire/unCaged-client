import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Settings_Stack = createNativeStackNavigator();

type Props = {
  navigation: { navigate: (route: string) => void };
  userImage: string;
  fetchData: (setUser: React.Dispatch<React.SetStateAction<User | null>>) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

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
        <Settings_Stack.Screen
          name="Settings"
          component={AccountScreen}
          options={{
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
          }}
        />
        <Settings_Stack.Screen
          name="My Account"
          component={AccountDetailsScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
              fontSize: 20,
            },
          }}
        />
        <Settings_Stack.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
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
          }}
        />
        <Settings_Stack.Screen
          name="Seen"
          component={SeenScreen}
          options={{
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
          }}
        />
        <Settings_Stack.Screen
          name="Ratings"
          component={RatingsScreen}
          options={{
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
          }}
        />
        <Settings_Stack.Screen
          name="Security"
          component={SecurityScreen}
          options={{
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
          }}
        />
        <Settings_Stack.Screen
          name="About"
          component={AboutScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
              fontSize: 20,
            },
          }}
        />
        <Settings_Stack.Screen
          name="Privacy Policy"
          component={PrivacyPolicyScreen}
          options={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontFamily: 'Montserrat-Bold',
              fontSize: 20,
            },
          }}
        />
      </Settings_Stack.Navigator>
    </View>
  );
}
