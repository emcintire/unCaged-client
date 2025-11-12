import { ComponentType, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {
  MaterialCommunityIcons, type MaterialCommunityIcons as MaterialCommunityIconsType,
} from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import { map } from 'lodash';
import colors from '../../config/colors';
import { useCurrentUser } from '../../api';
import HomeStackScreen from './HomeStackScreen';
import WatchlistStackScreen from './WatchlistStackScreen';
import SearchStackScreen from './SearchStackScreen';
import RandomMovieStackScreen from './RandomMovieStackScreen';
import SettingsStackScreen from './SettingsStackScreen';

const Home_Stack = createBottomTabNavigator();

const screens: Array<{
  name: string;
  Component: ComponentType<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  icon: keyof typeof MaterialCommunityIconsType.glyphMap;
}> = [
  {
    name: 'HomeTab',
    Component: HomeStackScreen,
    icon: 'home',
  }, {
    name: 'WatchlistTab',
    Component: WatchlistStackScreen,
    icon: 'bookmark',
  }, {
    name: 'SearchTab',
    Component: SearchStackScreen,
    icon: 'magnify',
  }, {
    name: 'RandomTab',
    Component: RandomMovieStackScreen,
    icon: 'dice-3',
  }, {
    name: 'SettingsTab',
    Component: SettingsStackScreen,
    icon: 'cog',
  },
];

export default function HomeStack() {
  const { refetch } = useCurrentUser();

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
      <Home_Stack.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.orange,
          tabBarInactiveTintColor: colors.medium,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: colors.black,
            height: 60,
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
        initialRouteName="HomeTab"
      >
        {map(screens, (screen) => (
          <Home_Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.Component}
            options={{
              tabBarIcon: ({ color }: { color: string }) => (
                <MaterialCommunityIcons name={screen.icon} color={color} size={28} />
              ),
            }}
          />
        ))}
      </Home_Stack.Navigator>
    </NavigationContainer>
  );
}
