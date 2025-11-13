import { Image, TouchableOpacity } from 'react-native';
import { useCurrentUser } from '../api';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { borderRadius } from '../config/theme';

const imageStyle = { width: 35, height: 35, borderRadius: borderRadius.circle / 2 };

export default function AccountButton() {
  const { data: user, refetch } = useCurrentUser();
  const { navigate } = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const handleNavigate = () => {
    refetch();
    navigate('SettingsTab');
  };

  return (
    <TouchableOpacity onPress={handleNavigate}>
      <Image source={{ uri: user?.img || '' }} style={imageStyle} />
    </TouchableOpacity>
  );
}
