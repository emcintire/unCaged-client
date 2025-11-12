import Toast from 'react-native-toast-message';
import { Movie } from '../api';

export const changeResolution = (res: string, movie: Movie): Movie => {
  const imgStr = movie.img.split('');
  imgStr[movie.img.length - 5] = res;
  movie.img = imgStr.join('');

  return movie;
};

export const changeProfilePicRes = (res: string, imgStr: string): string => {
  const str = imgStr.split('');
  str[imgStr.length - 5] = res;
  const newImgStr = str.join('');

  return newImgStr;
};

export const showSuccessToast = (text1: string = 'Changes saved successfully!'): void => {
  Toast.show({
    type: 'success',
    text1,
    autoHide: true,
  });
};

export const showErrorToast = (text1: string = 'Something went wrong'): void => {
  Toast.show({
    type: 'error',
    text1,
    autoHide: true,
  });
};

export const genres: Array<string> = [
  'Select',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
];
