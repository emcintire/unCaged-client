import React, { ComponentType } from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { map } from 'lodash';
import colors from '../../config/colors';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import WatchlistScreen from '../../screens/WatchlistScreen';
import type { User } from '../../types';

const Watchlist_Stack = createNativeStackNavigator();

type Props = {
  navigation: { navigate: (route: string) => void };
  userImage: string;
  fetchData: (setUser: React.Dispatch<React.SetStateAction<User | null>>) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const screens: Array<{
  name: string;
  component: ComponentType<any>;
  options: (props: Props) => NativeStackNavigationOptions;
}> = [
  {
    name: 'Watchlist',
    component: WatchlistScreen,
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
];

export default function WatchlistStackScreen({
  navigation,
  userImage,
  fetchData,
  setUser,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Watchlist_Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.black,
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      >
        {map(screens, (screen) => (
          <Watchlist_Stack.Screen
            key={screen.name}
            name={screen.name}
            component={screen.component}
            options={screen.options({ navigation, userImage, fetchData, setUser })}
          />
        ))}
      </Watchlist_Stack.Navigator>
    </View>
  );
}
