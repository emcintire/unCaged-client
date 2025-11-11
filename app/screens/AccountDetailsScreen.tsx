import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';

import Screen from '../components/Screen';
import colors from '../config/colors';
import PicturePicker from '../components/PicturePicker';
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import { showErrorToast, showSuccessToast } from '../config/helperFunctions';
import { User } from '../types';
import { NavigateFunction } from 'react-router-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types/homeStackParamList';

type FormValues = {
  name: string;
  email: string;
};

const handleSubmit = async (
  navigation: NativeStackScreenProps<HomeStackParamList, 'SettingsTab'>['navigation'],
  values: FormValues,
  user: User,
  token: string
) => {
  const name = values.name || user.name;
  const email = values.email || user.email;

  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({
      name: name,
      email: email.toLowerCase(),
    }),
  });

  const body = await response.text();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    navigation.navigate('SettingsTab');
    EventRegister.emit('refreshPic');
    showSuccessToast();
  }
};

const getData = async (
  setUser: Dispatch<SetStateAction<User | null>>,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setToken: Dispatch<SetStateAction<string>>
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token == null) {
      return;
    }
    const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    });

    const body = await response.json();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      setUser(body);
      setLoading(false);
      setToken(token);
    }
  } catch (err) {
    console.log(err);
  }
};

export default function AccountDetailsScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, 'SettingsTab'>) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getData(setUser, setIsLoading, setToken);
  }, []);

  return (
    <Screen isLoading={isLoading} style={styles.screen}>
      <Modal
        style={{ width: '100%', height: '100%' }}
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <PicturePicker
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          user={user!}
          token={token}
        />
      </Modal>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
          <View style={styles.overlay}>
            <MaterialCommunityIcons name="pencil" size={40} color="white" />
          </View>
          <Image source={{ uri: user!.img }} style={styles.image} />
        </TouchableOpacity>
      </View>
      <View style={styles.formContainer}>
        <AppForm<FormValues>
          initialValues={{ name: user!.name, email: user!.email }}
          onSubmit={(values) => handleSubmit(navigation, values, user!, token)}
          validationSchema={validationSchema}
        >
          <AppFormField<FormValues> icon="account" name="name" textContentType="name" />
          <AppFormField<FormValues>
            icon="email"
            keyboardType="email-address"
            name="email"
            textContentType="emailAddress"
          />
          <SubmitButton<FormValues> title="Save" style={styles.saveButton} />
        </AppForm>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.bg,
    height: '100%',
    width: '100%',
    padding: 15,
  },
  imageContainer: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  saveButton: {
    marginTop: 30,
  },
  formContainer: {
    marginTop: 50,
  },
  overlay: {
    position: 'absolute',
    height: 150,
    width: 150,
    borderRadius: 75,
    backgroundColor: '#00000060',
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Name').required(),
  email: Yup.string().email().label('Email').required(),
});
