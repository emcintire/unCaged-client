import React, { ReactNode, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';

import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import Separator from '../components/Separator';
import colors from '../config/colors';
import Icon from '../components/Icon';
import { NavigateFunction, useNavigate } from 'react-router-native';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';
import { SetState, User } from '../types';
import { map } from 'lodash';

const fetchData = async (setUser: SetState<User | null>, setLoading: SetState<boolean>) => {
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
      setLoading(false);
    }
  } catch (err) {
    console.log(err);
  }
};

const deleteAccount = async (navigate: NavigateFunction) => {
  Alert.alert('Are you sure?', 'Daddy would not be pleased', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Ok',
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem('token');
          const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'x-auth-token': token || '',
            },
          });

          const body = await response.text();

          if (response.status !== 200) {
            showErrorToast(body);
          } else {
            await AsyncStorage.removeItem('token');
            showSuccessToast('Account deleted :(');
            navigate('/');
          }
        } catch (err) {
          console.log(err);
        }
      },
    },
  ]);
};

const handleLogOut = (navigate: NavigateFunction) => {
  Alert.alert('Are you sure you want to log out?', '', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Ok',
      onPress: async () => {
        await AsyncStorage.removeItem('token');
        navigate('/');
      },
    },
  ]);
};

const accountItems: Array<{
  children?: ReactNode;
  title: string;
  iconName: keyof typeof MaterialCommunityIconsType.glyphMap;
  iconColor: string;
}> = [
  {
    children: <Separator />,
    title: 'My Seen',
    iconName: 'eye',
    iconColor: colors.orange,
  },
  {
    children: <Separator />,
    title: 'My Favorites',
    iconName: 'heart',
    iconColor: colors.orange,
  },
  {
    children: <View style={{ height: 20, backgroundColor: colors.bg }} />,
    title: 'My Ratings',
    iconName: 'star',
    iconColor: colors.orange,
  },
  {
    children: <Separator />,
    title: 'Security',
    iconName: 'lock',
    iconColor: colors.white,
  },
  {
    children: <Separator />,
    title: 'Privacy Policy',
    iconName: 'shield-alert',
    iconColor: colors.white,
  },
  {
    title: 'About',
    iconName: 'help',
    iconColor: colors.white,
  },
];

export default function AccountScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(setUser, setLoading);
  }, []);

  return (
    <Screen isLoading={loading} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
        <View style={styles.container}>
          <ListItem
            onPress={() => navigate('My Account')}
            title={user!.name}
            subTitle={user!.email}
            image={{ uri: user!.img }}
          />
        </View>
        <Separator modal={false} />
        <View>
          {map(accountItems, (item) => (
            <>
              <ListItem
                onPress={() => navigate(item.title)}
                title={item.title}
                IconComponent={<Icon name={item.iconName} iconColor={item.iconColor} backgroundColor={colors.bg} />}
              />
              {item.children}
            </>
          ))}
        </View>
        <View style={{ height: 20, backgroundColor: colors.bg }} />
        <ListItem
          onPress={() => handleLogOut(navigate)}
          title="Log Out"
          IconComponent={<Icon name="logout" backgroundColor={colors.bg} iconColor={colors.red} />}
        />
        <Separator />
        <ListItem
          onPress={() => deleteAccount(navigate)}
          title="Delete Account"
          IconComponent={<Icon name="delete" backgroundColor={colors.bg} iconColor={colors.red} />}
        />
        <View style={{ height: 40, backgroundColor: colors.bg }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  screen: {
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
  },
  tagline: {
    marginTop: 40,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: colors.white,
    alignSelf: 'center',
  },
  subTagline: {
    fontFamily: 'Montserrat-Light',
    fontSize: 13,
    color: colors.white,
    alignSelf: 'flex-start',
  },
});
