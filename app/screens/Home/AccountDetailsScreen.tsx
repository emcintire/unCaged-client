import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native';
import * as Yup from 'yup';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { EventRegister } from 'react-native-event-listeners';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import Screen from '../../components/Screen';
import colors from '../../config/colors';
import PicturePicker from '../../components/PicturePicker';
import { AppForm, AppFormField, SubmitButton } from '../../components/forms';
import { showErrorToast, showSuccessToast } from '../../config/helperFunctions';
import type { HomeStackParamList } from '../../types/homeStackParamList';
import { useCurrentUser, useUpdateUser } from '../../api/controllers/users.controller';

type FormValues = {
  name: string;
  email: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Name').required(),
  email: Yup.string().email().label('Email').required(),
});

export default function AccountDetailsScreen({
  navigation,
}: NativeStackScreenProps<HomeStackParamList, 'SettingsTab'>) {
  const [modalVisible, setModalVisible] = useState(false);
  
  const { data: user, isLoading } = useCurrentUser();
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (values: FormValues) => {
    if (!user) return;

    try {
      await updateUserMutation.mutateAsync({
        name: values.name || user.name,
        email: values.email.toLowerCase() || user.email,
      });
      navigation.navigate('SettingsTab');
      EventRegister.emit('refreshPic');
      showSuccessToast();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update account';
      showErrorToast(message);
    }
  };

  return (
    <Screen isLoading={isLoading} style={styles.screen}>
      {user && (
        <>
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
              user={user}
            />
          </Modal>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
              <View style={styles.overlay}>
                <MaterialCommunityIcons name="pencil" size={40} color="white" />
              </View>
              <Image source={{ uri: user.img }} style={styles.image} />
            </TouchableOpacity>
          </View>
          <View style={styles.formContainer}>
            <AppForm<FormValues>
              initialValues={{ name: user.name, email: user.email }}
              onSubmit={handleSubmit}
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
        </>
      )}
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
