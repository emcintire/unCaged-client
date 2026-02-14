import { StyleSheet, TouchableOpacity, View } from 'react-native'

import type { SetState } from '@/types';
import { type Movie, useDeleteRating, useRateMovie, useAddToSeen, useCurrentUser } from '@/services';
import { borderRadius, colors, showErrorToast, spacing } from '@/config';
import Icon from '../Icon'

const styles = StyleSheet.create({
  stars: {
    marginTop: spacing.xs,
    backgroundColor: colors.black,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
});

const stars = [1, 2, 3, 4, 5];

type Props = {
  movie: Movie;
  onSeenAdded: () => void;
  rating: number;
  setRating: SetState<number>;
};

export default function MovieModalRating({ movie, onSeenAdded, rating, setRating }: Props) {
  const rateMovieMutation = useRateMovie();
  const deleteRatingMutation = useDeleteRating();
  const addToSeenMutation = useAddToSeen();
  const { data: user } = useCurrentUser();

  const handleRating = (newRating: number) => async () => {
    try {
      if (rating === newRating) {
        await deleteRatingMutation.mutateAsync({ id: movie._id });
        setRating(0);
        return;
      }

      await rateMovieMutation.mutateAsync({ id: movie._id, rating: newRating });
      setRating(newRating);
      
      const isMovieSeen = user && user.seen.includes(movie._id);
      if (!isMovieSeen) {
        await addToSeenMutation.mutateAsync(movie._id);
        onSeenAdded();
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update rating';
      showErrorToast(message);
    }
  };

  return (
    <View style={styles.stars}>
      {stars.map((star) => (
        <TouchableOpacity key={star} onPress={handleRating(star)} accessibilityRole="button" accessibilityLabel={`Rate ${star} star${star > 1 ? 's' : ''}`}>
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
