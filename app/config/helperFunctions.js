import Toast from 'react-native-toast-message';

export const changeResolution = (res, movie) => {
  const imgStr = movie.img.split('');
  imgStr[movie.img.length - 5] = res;
  movie.img = imgStr.join('');

  return movie;
};

export const changeProfilePicRes = (res, imgStr) => {
  const str = imgStr.split('');
  str[imgStr.length - 5] = res;
  imgStr = str.join('');

  return imgStr;
};

export const showSuccessToast = (text1 = 'Changes saved successfully!') => {
  Toast.show({
    type: 'success',
    text1,
    autoHide: true,
  });
}

export const showErrorToast = (text1 = 'Something went wrong') => {
  Toast.show({
    type: 'error',
    text1,
    autoHide: true,
  });
}

export const genres = [
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
