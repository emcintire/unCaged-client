import { Fragment, ReactNode } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { map } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { useNavigate } from 'react-router-native';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { showErrorToast, showSuccessToast } from '../../config/helperFunctions';
import { useCurrentUser, useDeleteUser } from '../../api/controllers/users.controller';
import { useClearCache } from '../../api';
import type { SettingsTabParamList } from '../../types';
import Screen from '../../components/Screen';
import ListItem from '../../components/ListItem';
import Separator from '../../components/Separator';
import colors from '../../config/colors';
import Icon from '../../components/Icon';

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

export default function SettingsScreen() {
  const { data: user, isLoading } = useCurrentUser();
  const deleteUserMutation = useDeleteUser();
  const clearCache = useClearCache();
  const navigate = useNavigate();
  const navigation = useNavigation<NativeStackNavigationProp<SettingsTabParamList>>();

  const deleteAccount = async () => {
    Alert.alert('Are you sure?', 'Daddy would not be pleased', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Ok',
        onPress: async () => {
          try {
            await deleteUserMutation.mutateAsync({ id: user!._id });
            showSuccessToast('Account deleted :(');
            navigate('/');
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to delete account';
            showErrorToast(message);
          }
        },
      },
    ]);
  };

  const logOut = () => {
    Alert.alert('Are you sure you want to log out?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Ok',
        onPress: async () => {
          clearCache();
          navigate('/');
        },
      },
    ]);
  };

  return (
    <Screen isLoading={isLoading}>
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
          onPress={logOut}
          title="Log Out"
          IconComponent={<Icon name="logout" backgroundColor={colors.bg} iconColor={colors.red} />}
        />
        <Separator />
        <ListItem
          onPress={deleteAccount}
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
});
