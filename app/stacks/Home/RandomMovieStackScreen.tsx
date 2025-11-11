import React from 'react';
import { TouchableOpacity, View, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import colors from '../../config/colors';
import SmallLogo from '../../assets/imgs/small_logo.svg';
import RandomMovieScreen from '../../screens/RandomMovieScreen';
import type { User } from '../../types';

const Random_Stack = createNativeStackNavigator();

type Props = {
  navigation: { navigate: (route: string) => void };
  userImage: string;
  fetchData: (setUser: React.Dispatch<React.SetStateAction<User | null>>) => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export default function RandomMovieStackScreen({
  navigation,
  userImage,
  fetchData,
  setUser,
}: Props) {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Random_Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.black,
          },
          headerTintColor: '#fff',
          headerBackTitleVisible: false,
        }}
      >
        <Random_Stack.Screen
          name="Random"
          component={RandomMovieScreen}
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
      </Random_Stack.Navigator>
    </View>
  );
}
