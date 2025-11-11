import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import { find, includes } from 'lodash';
import Icon from '../Icon';
import colors from '../../config/colors';
import { Movie, User } from '../../types';
import MovieRating from './MovieRating';
import {
  useAddToSeen,
  useRemoveFromSeen,
  useAddToFavorites,
  useRemoveFromFavorites,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from '../../api';

type Props = {
  movie: Movie;
  onUpdateMovieRating: (id: string) => void;
  token: string;
  user: User;
};

export default function MovieActions({
  movie,
  onUpdateMovieRating,
  token,
  user,
}: Props) {
  const [favorite, setFavorite] = useState(false);
  const [seen, setSeen] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [showStars, setShowStars] = useState(false);

  // TanStack Query mutations
  const addToSeenMutation = useAddToSeen();
  const removeFromSeenMutation = useRemoveFromSeen();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addToWatchlistMutation = useAddToWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  useEffect(() => {
    setFavorite(includes(user.favorites, movie._id));
    setSeen(includes(user.seen, movie._id));
    setWatchlist(includes(user.watchlist, movie._id));
    setRating(find(user.ratings, ['movieId', movie._id])?.rating || 0);
  }, [user, movie._id]);

  const handleSeenToggle = () => {
    if (seen) {
      removeFromSeenMutation.mutate(movie._id, {
        onSuccess: () => setSeen(false),
      });
    } else {
      addToSeenMutation.mutate(movie._id, {
        onSuccess: () => setSeen(true),
      });
    }
  };

  const handleFavoriteToggle = () => {
    if (favorite) {
      removeFromFavoritesMutation.mutate(movie._id, {
        onSuccess: () => setFavorite(false),
      });
    } else {
      addToFavoritesMutation.mutate(movie._id, {
        onSuccess: () => setFavorite(true),
      });
    }
  };

  const handleWatchlistToggle = () => {
    if (watchlist) {
      removeFromWatchlistMutation.mutate(movie._id, {
        onSuccess: () => setWatchlist(false),
      });
    } else {
      addToWatchlistMutation.mutate(movie._id, {
        onSuccess: () => setWatchlist(true),
      });
    }
  };

  const styles = StyleSheet.create({
    seenLabel: {
      position: 'absolute',
      top: 45,
      color: seen ? colors.orange : colors.medium,
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
    },
    rateLabel: {
      position: 'absolute',
      top: 45,
      color: rating > 0 ? colors.orange : colors.medium,
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
    },
    favLabel: {
      position: 'absolute',
      top: 45,
      color: favorite ? colors.orange : colors.medium,
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
    },
    watchLabel: {
      position: 'absolute',
      top: 45,
      color: watchlist ? colors.orange : colors.medium,
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
    },
  });

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleSeenToggle}>
            <Icon
              name="eye"
              size={60}
              backgroundColor={colors.bg}
              iconColor={seen ? colors.orange : colors.medium}
            />
          </TouchableOpacity>
          <Text style={styles.seenLabel}>Seen</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setShowStars(!showStars)}>
            <Icon
              name="star"
              size={60}
              backgroundColor={colors.bg}
              iconColor={rating > 0 ? colors.orange : colors.medium}
            />
          </TouchableOpacity>
          <Text style={styles.rateLabel}>Rate</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleFavoriteToggle}>
            <Icon
              name="heart"
              size={60}
              backgroundColor={colors.bg}
              iconColor={favorite ? colors.orange : colors.medium}
            />
          </TouchableOpacity>
          <Text style={styles.favLabel}>Favorite</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <TouchableOpacity onPress={handleWatchlistToggle}>
            <Icon
              name="bookmark"
              size={60}
              backgroundColor={colors.bg}
              iconColor={watchlist ? colors.orange : colors.medium}
            />
          </TouchableOpacity>
          <Text style={styles.watchLabel}>Watchlist</Text>
        </View>
      </View>
      <MovieRating
        rating={rating}
        setRating={setRating}
        token={token}
        movie={movie}
        onUpdateMovieRating={onUpdateMovieRating}
      />
    </>
  );
}
