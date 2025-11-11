import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from '../Icon';
import colors from '../../config/colors';
import { Movie, SetState, User } from '../../types';
import { showErrorToast } from '../../config/helperFunctions';
import { useEffect, useState } from 'react';
import MovieRating from './MovieRating';
import { find, includes } from 'lodash';

const addToSeen = async (id: string, token: string, setSeen: SetState<boolean>): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/seen', {
    method: 'PUT',
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
    setSeen(true);
  }
};

const addToFavorites = async (
  id: string,
  token: string,
  setFavorite: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/favorites', {
    method: 'PUT',
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
    setFavorite(true);
  }
};

const addToWatchlist = async (
  id: string,
  token: string,
  setWatchlist: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/watchlist', {
    method: 'PUT',
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
    setWatchlist(true);
  }
};

const removeFromSeen = async (
  id: string,
  token: string,
  setSeen: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/seen', {
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
    setSeen(false);
  }
};

const removeFromFavorites = async (
  id: string,
  token: string,
  setFavorites: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/favorites', {
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
    setFavorites(false);
  }
};

const removeFromWatchlist = async (
  id: string,
  token: string,
  setWatchlist: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/watchlist', {
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
    setWatchlist(false);
  }
};

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

  useEffect(() => {
    setFavorite(includes(user.favorites, movie._id));
    setSeen(includes(user.seen, movie._id));
    setWatchlist(includes(user.watchlist, movie._id));
    setRating(find(user.ratings, ['movieId', movie._id])?.rating || 0);
  }, []);

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
          <TouchableOpacity
            onPress={() => seen
              ? removeFromSeen(movie._id, token, setSeen)
              : addToSeen(movie._id, token, setSeen)}
          >
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
          <TouchableOpacity
            onPress={() => favorite
              ? removeFromFavorites(movie._id, token, setFavorite)
              : addToFavorites(movie._id, token, setFavorite)}
          >
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
          <TouchableOpacity
            onPress={() => watchlist
              ? removeFromWatchlist(movie._id, token, setWatchlist)
              : addToWatchlist(movie._id, token, setWatchlist)}
          >
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
  )
}
