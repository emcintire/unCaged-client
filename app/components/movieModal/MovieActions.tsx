import { StyleProp, StyleSheet, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';
import { find, includes, map } from 'lodash';
import type { MaterialCommunityIcons as MaterialCommunityIconsType } from '@expo/vector-icons';
import Icon from '../Icon';
import colors from '../../config/colors';
import MovieRating from './MovieRating';
import {
  useAddToSeen, useRemoveFromSeen, useAddToFavorites, useRemoveFromFavorites, useAddToWatchlist,
  useRemoveFromWatchlist, useCurrentUser, type Movie,
} from '../../api';

type Props = {
  movie: Movie;
};

export default function MovieActions({ movie }: Props) {
  const [favorite, setFavorite] = useState(false);
  const [seen, setSeen] = useState(false);
  const [watchlist, setWatchlist] = useState(false);
  const [rating, setRating] = useState(0);
  const [showStars, setShowStars] = useState(false);

  const addToSeenMutation = useAddToSeen();
  const removeFromSeenMutation = useRemoveFromSeen();
  const addToFavoritesMutation = useAddToFavorites();
  const removeFromFavoritesMutation = useRemoveFromFavorites();
  const addToWatchlistMutation = useAddToWatchlist();
  const removeFromWatchlistMutation = useRemoveFromWatchlist();

  const { data: user } = useCurrentUser();

  useEffect(() => {
    if (!user) { return; }
    setFavorite(includes(user.favorites, movie._id));
    setSeen(includes(user.seen, movie._id));
    setWatchlist(includes(user.watchlist, movie._id));
    setRating(find(user.ratings, ['movieId', movie._id])?.rating || 0);
  }, [user, movie]);

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
    seenLabel: { color: seen ? colors.orange : colors.medium },
    rateLabel: { color: rating > 0 ? colors.orange : colors.medium },
    favLabel: { color: favorite ? colors.orange : colors.medium },
    watchLabel: { color: watchlist ? colors.orange : colors.medium },
    shared: {
      position: 'absolute',
      top: 45,
      fontFamily: 'Montserrat-Medium',
      fontSize: 9,
    },
  });

  const actions: Array<{
    active: boolean;
    icon: keyof typeof MaterialCommunityIconsType.glyphMap;
    label: string;
    onPress: () => void;
    style: StyleProp<TextStyle>,
  }> = useMemo(() => [{
    active: seen,
    icon: 'eye',
    label: 'Seen',
    onPress: handleSeenToggle,
    style: styles.seenLabel,
  }, {
    active: rating > 0,
    icon: 'star',
    label: 'Rate',
    onPress: () => setShowStars(!showStars),
    style: styles.rateLabel,
  }, {
    active: favorite,
    icon: 'heart',
    label: 'Favorite',
    onPress: handleFavoriteToggle,
    style: styles.favLabel,
  }, {
    active: watchlist,
    icon: 'bookmark',
    label: 'Watchlist',
    onPress: handleWatchlistToggle,
    style: styles.watchLabel,
  }], [favorite, rating, seen, showStars, watchlist]);

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
        {map(actions, (action) => (
          <View key={action.label} style={{ alignItems: 'center' }}>
            <TouchableOpacity onPress={action.onPress}>
              <Icon
                name={action.icon}
                size={60}
                backgroundColor={colors.bg}
                iconColor={action.active ? colors.orange : colors.medium}
              />
            </TouchableOpacity>
            <Text style={[styles.shared, action.style]}>{action.label}</Text>
          </View>
        ))}
      </View>
      {showStars && <MovieRating rating={rating} setRating={setRating} movie={movie} />}
    </>
  );
}
