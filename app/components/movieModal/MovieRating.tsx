import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { map } from 'lodash';
import Icon from '../Icon'
import type { SetState } from '../../types';
import colors from '../../config/colors';
import { showErrorToast } from '../../config/helperFunctions';
import { useDeleteRating, useUpdateMovieRating } from '../../api/controllers/movies.controller';
import { type Movie, useRateMovie } from '../../api';

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

type Props = {
  movie: Movie;
  rating: number;
  setRating: SetState<number>;
};

export default function MovieRating({ movie, rating, setRating }: Props) {
  const rateMovieMutation = useRateMovie();
  const deleteRatingMutation = useDeleteRating();
  const updateMovieRatingMutation = useUpdateMovieRating();

  const handleRating = (newRating: number) => async () => {
    try {
      if (rating) {
        if (rating === newRating) {
          await deleteRatingMutation.mutateAsync({ id: movie._id });
          setRating(0);
        } else {
          await deleteRatingMutation.mutateAsync({ id: movie._id });
          await rateMovieMutation.mutateAsync({ id: movie._id, rating: newRating });
          setRating(newRating);
        }
      } else {
        await rateMovieMutation.mutateAsync({ id: movie._id, rating: newRating });
        setRating(newRating);
      }
      
      updateMovieRatingMutation.mutate({ id: movie._id });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update rating';
      showErrorToast(message);
    }
  };

  return (
    <View style={styles.stars}>
      {map(stars, (star) => (
        <TouchableOpacity key={star} onPress={handleRating(star)}>
          <Icon
            name="star"
            size={60}
            backgroundColor="transparent"
            iconColor={rating > star - 1 ? colors.orange : colors.medium}
          />
        </TouchableOpacity>
      ))}
    </View>
  )
}
