import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity, Dimensions, Text } from 'react-native';
import { filter } from 'lodash';
import { changeResolution, showErrorToast } from '../config/helperFunctions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Movie } from '../types';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AdBanner from '../components/AdBanner';
import MovieModal from '../components/movieModal/MovieModal';
import RandomMovieFilters from '../components/RandomMovieFilters';

const fetchUserData = async (
  setToken: (token: string) => void,
  setIsAdmin: (isAdmin: boolean) => void,
  getRandomMovie: () => Promise<void>
): Promise<void> => {
  const token = await AsyncStorage.getItem('token');
  if (token == null) { return; }

  const response = await fetch('https://uncaged-server.herokuapp.com/api/users', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
  });

  const body = await response.json();

  if (response.status !== 200) {
    showErrorToast(body);
    return;
  }

  setToken(token);
  setIsAdmin(body.isAdmin);
  await getRandomMovie();
};

export default function RandomMovieScreen() {
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [genreFilter, setGenreFilter] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mandyFilter, setMandyFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [token, setToken] = useState('');
  const [watchlistFilter, setWatchlistFilter] = useState(false);
  const [unseenFilter, setUnseenFilter] = useState(false);

  const getRandomMovie = useCallback(async () => {
    setIsLoading(true);

    const response = await fetch('https://uncaged-server.herokuapp.com/api/users/filteredMovies', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({
        unseen: unseenFilter,
        mandy: mandyFilter,
        watchlist: watchlistFilter,
        genre: genreFilter,
      }),
    });

    const movies = await response.json() as Array<Movie> | string;
    if (response.status !== 200) {
      showErrorToast(movies as string);
      setIsLoading(false);
      return;
    }

    if (movies.length === 0) {
      setMovie(null);
      setIsLoading(false);
      return;
    }

    // Don't show same movie twice in a row
    const availableMovies = movies.length > 1 && !mandyFilter && movie
      ? filter(movies as Array<Movie>, (m) => m._id !== movie._id)
      : movies as Array<Movie>;

    const randInt = Math.floor(Math.random() * availableMovies.length);
    const selectedMovie = availableMovies[randInt];
    const resolvedMovie = changeResolution('', selectedMovie!);

    setMovie(resolvedMovie);
    setIsLoading(false);
  }, [genreFilter, mandyFilter, token, unseenFilter, watchlistFilter, movie]);

  useEffect(() => {
    fetchUserData(setToken, setIsAdmin, getRandomMovie);
  }, []);

  return (
    <Screen isLoading={isLoading} style={styles.container}>
      {!isAdmin && (
        <View style={styles.adContainer}>
          <AdBanner />
        </View>
      )}
      <MovieModal
        movie={movie!}
        onClose={() => setModalVisible(false)}
        isOpen={modalVisible}
        token={token}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={filtersModalVisible}
        onRequestClose={() => setFiltersModalVisible(false)}
      >
        <RandomMovieFilters
          genreFilter={genreFilter}
          mandyFilter={mandyFilter}
          setFiltersModalVisible={setFiltersModalVisible}
          setGenreFilter={setGenreFilter}
          setMandyFilter={setMandyFilter}
          setUnseenFilter={setUnseenFilter}
          setWatchlistFilter={setWatchlistFilter}
          unseenFilter={unseenFilter}
          watchlistFilter={watchlistFilter}
        />
      </Modal>
      {movie === null ? (
        <View style={{ height: '80%', justifyContent: 'center' }}>
          <Text style={styles.noResults}>No results :(</Text>
        </View>
      ) : (
        <View style={styles.movieContainer}>
          <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
            <Image source={{ uri: movie.img }} style={styles.image} />
          </TouchableOpacity>
        </View>
      )}
      <View>
        <TouchableOpacity style={styles.refreshBtn} onPress={getRandomMovie}>
          <View style={styles.inner}>
            <Text style={styles.text}>CAGE ME</Text>
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.filtersBtn}
        onPress={() => setFiltersModalVisible(true)}
      >
        <MaterialCommunityIcons name="tune" color="grey" size={35} />
      </TouchableOpacity>
    </Screen>
  );
}

const screen = Dimensions.get('window').width + Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  movieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: screen < 1100 ? 285 : 320,
    height: screen < 1100 ? 435 : 485,
    shadowColor: '#00000080',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    backgroundColor: '#000000',
    elevation: 3,
    borderRadius: 8,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  refreshBtn: {
    height: 60,
    width: 150,
    backgroundColor: '#976000',
    borderRadius: 12,
    padding: 0,
    marginVertical: 10,
  },
  noResults: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 150,
    borderRadius: 12,
    backgroundColor: colors.orange,
  },
  text: {
    fontSize: 22,
    fontFamily: 'Montserrat-Black',
    color: 'white',
  },
  filtersBtn: {
    position: 'absolute',
    right: 40,
    bottom: 55,
  },
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: -25,
  },
});
