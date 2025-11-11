import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import Separator from '../components/Separator';
import colors from '../config/colors';
import Icon from '../components/Icon';
import Loading from '../components/Loading';
import { useNavigate } from 'react-router-native';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';

const fetchData = async (setUser, setLoading) => {
  AsyncStorage.getItem('token')
    .then(async (token) => {
      let response = await fetch(
        'https://uncaged-server.herokuapp.com/api/users/',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-auth-token': token,
          },
        }
      );

      const body = await response.json();

      if (response.status !== 200) {
        showErrorToast(body);
      } else {
        setUser(body);
        setLoading(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteAccount = async (history) => {
  Alert.alert('Are you sure?', 'Daddy would not be pleased', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Ok',
      onPress: async () => {
        AsyncStorage.getItem('token')
          .then(async (token) => {
            let response = await fetch(
              'https://uncaged-server.herokuapp.com/api/users/',
              {
                method: 'DELETE',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'x-auth-token': token,
                },
              }
            );

            const body = await response.text();

            if (response.status !== 200) {
              showErrorToast(body);
            } else {
              AsyncStorage.removeItem('token')
                .then(() => {
                  showSuccessToast('Account deleted :(');
                  navigate('/');
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
  ]);
};

const handleLogOut = (history) => {
  Alert.alert('Are you sure you want to log out?', '', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Ok',
      onPress: async () => {
        AsyncStorage.removeItem('token')
          .then(() => {
            navigate('/');
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  ]);
};

function AccountScreen(props) {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData(setUser, setLoading);
  }, []);

  if (!loading) {
    return (
      <Screen style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
        >
          <View style={styles.container}>
            <ListItem
              onPress={() =>
                props.navigation.navigate('My Account')
              }
              title={user.name}
              subTitle={user.email}
              image={{ uri: user.img }}
            />
          </View>
          <Separator modal={false} />

          <View>
            <ListItem
              onPress={() => props.navigation.navigate('Seen')}
              title="My Seen"
              IconComponent={
                <Icon
                  name="eye"
                  iconColor={colors.orange}
                  backgroundColor={colors.bg}
                />
              }
            />
            <Separator />
            <ListItem
              onPress={() =>
                props.navigation.navigate('Favorites')
              }
              title="My Favorites"
              IconComponent={
                <Icon
                  name="heart"
                  iconColor={colors.orange}
                  backgroundColor={colors.bg}
                />
              }
            />
            <Separator />
            <ListItem
              onPress={() => props.navigation.navigate('Ratings')}
              title="My Ratings"
              IconComponent={
                <Icon
                  name="star"
                  iconColor={colors.orange}
                  backgroundColor={colors.bg}
                />
              }
            />
            <View
              style={{ height: 20, backgroundColor: colors.bg }}
            />
            <ListItem
              onPress={() =>
                props.navigation.navigate('Security')
              }
              title="Security"
              IconComponent={
                <Icon
                  name="lock"
                  iconColor={colors.white}
                  backgroundColor={colors.bg}
                />
              }
            />
            <Separator />
            <ListItem
              onPress={() =>
                props.navigation.navigate('Privacy Policy')
              }
              title="Privacy Policy"
              IconComponent={
                <Icon
                  name="shield-alert"
                  iconColor={colors.white}
                  backgroundColor={colors.bg}
                />
              }
            />
            <Separator />
            <ListItem
              onPress={() => props.navigation.navigate('About')}
              title="About"
              IconComponent={
                <Icon
                  name="help"
                  iconColor={colors.white}
                  backgroundColor={colors.bg}
                />
              }
            />
          </View>
          <View style={{ height: 20, backgroundColor: colors.bg }} />
          <ListItem
            onPress={() => handleLogOut(history)}
            title="Log Out"
            IconComponent={
              <Icon
                name="logout"
                backgroundColor={colors.bg}
                iconColor={colors.red}
              />
            }
          />
          <Separator />
          <ListItem
            onPress={() => deleteAccount(history)}
            title="Delete Account"
            IconComponent={
              <Icon
                name="delete"
                backgroundColor={colors.bg}
                iconColor={colors.red}
              />
            }
          />
          <View style={{ height: 40, backgroundColor: colors.bg }} />
        </ScrollView>
      </Screen>
    );
  } else return <Loading />;
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

export default AccountScreen;
