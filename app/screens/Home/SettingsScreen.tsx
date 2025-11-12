import React, { Fragment, ReactNode } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';

import Screen from '../../components/Screen';
import ListItem from '../../components/ListItem';
import Separator from '../../components/Separator';
import colors from '../../config/colors';
import Icon from '../../components/Icon';
import { NavigateFunction, useNavigate } from 'react-router-native';
import { showErrorToast, showSuccessToast } from '../../config/helperFunctions';
import { SettingsTabParamList } from '../../types';
import { map } from 'lodash';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCurrentUser } from '../../api/controllers/users.controller';
import { apiClient } from '../../api/client';

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
          await apiClient.delete('/users/', {});
          await AsyncStorage.removeItem('token');
          showSuccessToast('Account deleted :(');
          navigate('/');
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to delete account';
          showErrorToast(message);
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
  title: keyof SettingsTabParamList;
  iconName: keyof typeof MaterialCommunityIconsType.glyphMap;
  iconColor: string;
}> = [{
  children: <Separator />,
  title: 'Seen',
  iconName: 'eye',
  iconColor: colors.orange,
}, {
  children: <Separator />,
  title: 'Favorites',
  iconName: 'heart',
  iconColor: colors.orange,
}, {
  children: <View style={{ height: 20, backgroundColor: colors.bg }} />,
  title: 'Ratings',
  iconName: 'star',
  iconColor: colors.orange,
}, {
  children: <Separator />,
  title: 'Security',
  iconName: 'lock',
  iconColor: colors.white,
}, {
  children: <Separator />,
  title: 'Privacy Policy',
  iconName: 'shield-alert',
  iconColor: colors.white,
}, {
  title: 'About',
  iconName: 'help',
  iconColor: colors.white,
}];

export default function SettingsScreen({
  navigation,
}: NativeStackScreenProps<SettingsTabParamList, 'Settings'>) {
  const { data: user, isLoading } = useCurrentUser();

  const navigate = useNavigate();

  return (
    <Screen isLoading={isLoading} style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
        <View style={styles.container}>
          <ListItem
            onPress={() => navigation.navigate('My Account')}
            title={user!.name}
            subTitle={user!.email}
            image={{ uri: user!.img }}
          />
        </View>
        <Separator modal={false} />
        <View>
          {map(accountItems, (item) => (
            <Fragment key={item.title}>
              <ListItem
                onPress={() => navigation.navigate(item.title)}
                title={item.title}
                IconComponent={(
                  <Icon name={item.iconName} iconColor={item.iconColor} backgroundColor={colors.bg} />
                )}
              />
              {item.children}
            </Fragment>
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
    backgroundColor: colors.bg,
    width: '100%',
  },
  screen: {
    backgroundColor: colors.bg,
    padding: 0,
    width: '100%',
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
