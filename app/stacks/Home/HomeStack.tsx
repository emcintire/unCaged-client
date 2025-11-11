import React, { ComponentType, useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  MaterialCommunityIcons, type MaterialCommunityIcons as MaterialCommunityIconsType,
} from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../config/colors';
import { showErrorToast } from '../../config/helperFunctions';
import type { User } from '../../types';
import HomeStackScreen from './HomeStackScreen';
import WatchlistStackScreen from './WatchlistStackScreen';
import SearchStackScreen from './SearchStackScreen';
import RandomMovieStackScreen from './RandomMovieStackScreen';
import AccountStackScreen from './AccountStackScreen';
import { map } from 'lodash';

const Tab = createMaterialBottomTabNavigator();

const fetchData = async (setUser: React.Dispatch<React.SetStateAction<User | null>>) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token || '',
      },
    });

    const body = await response.json();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      setUser(body);
    }
  } catch (err) {
    console.log(err);
  }
};

const screens: Array<{
  name: string;
  component: ComponentType<any>;
  icon: keyof typeof MaterialCommunityIconsType.glyphMap;
}> = [
  {
    name: 'HomeTab',
    component: HomeStackScreen,
    icon: 'home',
  }, {
    name: 'WatchlistTab',
    component: WatchlistStackScreen,
    icon: 'bookmark',
  }, {
    name: 'SearchTab',
    component: SearchStackScreen,
    icon: 'magnify',
  }, {
    name: 'RandomTab',
    component: RandomMovieStackScreen,
    icon: 'dice-3',
  }, {
    name: 'SettingsTab',
    component: AccountStackScreen,
    icon: 'cog',
  },
];

export default function HomeStack() {
  const [user, setUser] = useState<User | null>(null);
  const userImage = user?.img || '';

  useEffect(() => {
    fetchData(setUser);

    EventRegister.addEventListener('refreshPic', () => {
      fetchData(setUser);
    });

    return () => {
      EventRegister.removeAllListeners();
    };
  }, []);

  return (
    <NavigationContainer>
      <Tab.Navigator
        activeColor={colors.orange}
        inactiveColor={colors.medium}
        barStyle={{ backgroundColor: colors.black, height: 60 }}
        initialRouteName="HomeTab"
        shifting={true}
        labeled={false}
      >
        {map(screens, (screen) => (
          <Tab.Screen
            key={screen.name}
            name={screen.name}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name={screen.icon} color={color} size={28} />
              ),
            }}
          >
            {(props) => (
              <screen.component
                navigation={props.navigation}
                userImage={userImage}
                fetchData={fetchData}
                setUser={setUser}
              />
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
