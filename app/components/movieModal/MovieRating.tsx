import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from '../Icon'
import colors from '../../config/colors';
import { map } from 'lodash';
import { Movie, SetState } from '../../types';
import { showErrorToast } from '../../config/helperFunctions';

const styles = StyleSheet.create({
  stars: {
    marginTop: 5,
    backgroundColor: colors.black,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

const stars = [1, 2, 3, 4, 5];

const rateMovie = async (
  id: string,
  token: string,
  rating: number,
  setRating: SetState<number>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/rate', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ id, rating }),
  });

  const body = await response.text();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    setRating(rating);
  }
};

const removeRating = async (
  id: string,
  token: string,
  setRating: SetState<number>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/rate', {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    body: JSON.stringify({ id }),
  });

  const body = await response.text();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    setRating(0);
  }
};

const updateRating = (id: string): void => {
  fetch('https://uncaged-server.herokuapp.com/api/movies/updateRating', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });
};

type Props = {
  movie: Movie;
  onUpdateMovieRating: (id: string) => void;
  rating: number;
  setRating: SetState<number>;
  token: string;
};

export default function MovieRating({ movie, onUpdateMovieRating, rating, setRating, token }: Props) {
  const handleRating = (newRating: number) => async () => {
    if (rating) {
      if (rating === newRating) {
        await removeRating(movie._id, token, setRating);
      } else {
        await removeRating(movie._id, token, setRating);
        await rateMovie(movie._id, token, newRating, setRating);
      }
    } else {
      await rateMovie(movie._id, token, newRating, setRating);
    }
    onUpdateMovieRating(movie._id);
    updateRating(movie._id);
  };

  return (
    <View style={styles.stars}>
      {map(stars, (star) => (
        <TouchableOpacity onPress={handleRating(star)}>
          <Icon
            name="star"
            size={60}
            backgroundColor={colors.black}
            iconColor={rating > star - 1 ? colors.orange : colors.medium}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}
