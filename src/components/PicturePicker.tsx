import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { map } from 'lodash';
import { borderRadius, colors, showErrorToast, spacing } from '@/config';
import Screen from './Screen';
import AppButton from './AppButton';
import Icon from './Icon';
import { useCurrentUser, useUpdateUserImage } from '@/services';

type Props = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function PicturePicker({ modalVisible, setModalVisible }: Props) {
  const [selected, setSelected] = useState(0);

  const { data: user, refetch } = useCurrentUser();
  const updateUserImageMutation = useUpdateUserImage();

  const imgs = [
    'https://i.imgur.com/9NYgErPm.png',
    'https://i.imgur.com/Upkz8OFm.png',
    'https://i.imgur.com/29gBEEPm.png',
    'https://i.imgur.com/iigQEaqm.png',
    'https://i.imgur.com/J2pJMGlm.png',
    'https://i.imgur.com/EpKnEsOm.png',
  ];

  const getPicture = () => {
    imgs.forEach((link, index) => {
      if (link === user?.img) {
        setSelected(index);
      }
    });
  };

  useEffect(() => {
    getPicture();
  }, [user?.img]);

  const handleSubmit = async () => {
    const selectedImg = imgs[selected];
    if (!selectedImg) return;
    
    try {
      await updateUserImageMutation.mutateAsync({ img: selectedImg });
      setModalVisible(false);
      refetch();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update picture';
      showErrorToast(message);
    }
  };

  if (!modalVisible) { return null; }

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.closeButton}>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Icon name="close" size={30} backgroundColor={colors.black} iconColor={colors.red} />
          </TouchableOpacity>
        </View>
        <View style={styles.imagesContainer}>
          {map(imgs, (image, index) => (
            <View style={styles.imgContainer} key={index}>
              <View style={selected === index ? styles.selected : styles.notSelected}>
                <MaterialCommunityIcons name="check" size={40} color="white" />
              </View>

              <TouchableOpacity style={styles.imgBtn} onPress={() => setSelected(index)}>
                <Image
                  source={{
                    uri: image,
                  }}
                  style={styles.img}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <AppButton
          title="Save"
          onPress={() => handleSubmit()}
          style={{ width: '50%', alignSelf: 'center' }}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.bg,
    width: '90%',
    padding: spacing.md,
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: borderRadius.md,
  },
  closeButton: {
    position: 'absolute',
    right: spacing.sm,
    top: spacing.sm,
  },
  imagesContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  imgContainer: {
    width: '50%',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#00000080',
    height: 120,
    width: 120,
    zIndex: 1,
    borderRadius: borderRadius.circle * 2,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: spacing.sm,
  },
  notSelected: {
    display: 'none',
  },
  imgBtn: {
    width: 120,
    height: 120,
    marginVertical: spacing.sm,
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.circle * 2,
  },
});
