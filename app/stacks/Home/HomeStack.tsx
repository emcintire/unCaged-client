import React, { useEffect, useState } from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
        <Tab.Screen
          name="HomeTab"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={28} />
            ),
          }}
        >
          {(props) => (
            <HomeStackScreen
              navigation={props.navigation}
              userImage={userImage}
              fetchData={fetchData}
              setUser={setUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="WatchlistTab"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bookmark" color={color} size={28} />
            ),
          }}
        >
          {(props) => (
            <WatchlistStackScreen
              navigation={props.navigation}
              userImage={userImage}
              fetchData={fetchData}
              setUser={setUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SearchTab"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={28} />
            ),
          }}
        >
          {(props) => (
            <SearchStackScreen
              navigation={props.navigation}
              userImage={userImage}
              fetchData={fetchData}
              setUser={setUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="RandomTab"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="dice-3" color={color} size={28} />
            ),
          }}
        >
          {(props) => (
            <RandomMovieStackScreen
              navigation={props.navigation}
              userImage={userImage}
              fetchData={fetchData}
              setUser={setUser}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="SettingsTab"
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="cog" color={color} size={28} />
            ),
          }}
        >
          {(props) => (
            <AccountStackScreen
              navigation={props.navigation}
              userImage={userImage}
              fetchData={fetchData}
              setUser={setUser}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
