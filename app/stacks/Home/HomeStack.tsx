import React, { ComponentType, useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  MaterialCommunityIcons, type MaterialCommunityIcons as MaterialCommunityIconsType,
} from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import { map } from 'lodash';
import colors from '../../config/colors';
import type { User } from '../../types';
import { useCurrentUser } from '../../api';
import HomeStackScreen from './HomeStackScreen';
import WatchlistStackScreen from './WatchlistStackScreen';
import SearchStackScreen from './SearchStackScreen';
import RandomMovieStackScreen from './RandomMovieStackScreen';
import AccountStackScreen from './AccountStackScreen';

const Tab = createMaterialBottomTabNavigator();

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
  const { data: user, refetch } = useCurrentUser();
  const userImage = user?.img || '';

  useEffect(() => {
    const listener = EventRegister.addEventListener('refreshPic', () => {
      refetch();
    });

    return () => {
      if (typeof listener === 'string') {
        EventRegister.removeEventListener(listener);
      }
    };
  }, [refetch]);

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
                fetchData={refetch}
                setUser={() => {}} // Deprecated: now handled by React Query
              />
            )}
          </Tab.Screen>
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
}
