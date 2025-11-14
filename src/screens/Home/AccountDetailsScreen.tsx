import * as Yup from 'yup';
import { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { toLower, trim } from 'lodash';

import type { HomeStackParamList } from '@/types';
import { useCurrentUser, useUpdateUser } from '@/services';
import { showErrorToast, showSuccessToast, spacing } from '@/config';
import { AppForm, AppFormField, SubmitButton } from '@/components/forms';
import Screen from '@/components/Screen';
import PicturePicker from '@/components/PicturePicker';

type FormValues = {
  name: string;
  email: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().label('Name').required(),
  email: Yup.string().email().label('Email').required(),
});

export default function AccountDetailsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const { navigate } = useNavigation<NativeStackNavigationProp<HomeStackParamList, 'SettingsTab'>>();
  
  const { data: user, isLoading, refetch } = useCurrentUser();
  const updateUserMutation = useUpdateUser();

  const handleSubmit = async (values: FormValues) => {
    if (user == null || (values.name === user.name && values.email === user.email)) { return; }

    try {
      const email = toLower(trim(values.email));
      const name = trim(values.name);
      await updateUserMutation.mutateAsync({ name, email });
      navigate('SettingsTab');
      refetch();
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
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <PicturePicker modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
    padding: spacing.md,
  },
  imageContainer: {
    height: '20%',
    width: '100%',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  image: {
    height: 150,
    width: 150,
    borderRadius: 75,
  },
  saveButton: {
    marginTop: spacing.xxl,
  },
  formContainer: {
    marginTop: spacing.xxl + spacing.lg,
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
