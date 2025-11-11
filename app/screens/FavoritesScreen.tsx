import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { map } from 'lodash';
import AdBanner from '../components/AdBanner';

import { changeResolution, showErrorToast } from '../config/helperFunctions';
import Screen from '../components/Screen';
import colors from '../config/colors';
import MovieModal from '../components/movieModal/MovieModal';
import { Movie, SetState } from '../types';

const getUser = async (token: string, setIsAdmin: SetState<boolean>) => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
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
  } else {
    setIsAdmin(body.isAdmin);
  }
};

const getMovies = async (token: string, setMovies: SetState<Array<Movie>>) => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/favorites', {
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
  } else {
    setMovies(body);
  }
};

const fetchData = async (
  setMovies: SetState<Array<Movie>>,
  setIsLoading: SetState<boolean>,
  setToken: SetState<string>,
  setIsAdmin: SetState<boolean>,
) => {
  const token = await AsyncStorage.getItem('token');
  if (token == null) { return; }
  await Promise.all([getUser(token, setIsAdmin), getMovies(token, setMovies)]);
  setToken(token);
  setIsLoading(false);
};

export default function FavoritesScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    fetchData(setMovies, setIsLoading, setToken, setIsAdmin);
  }, []);

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? styles.noMoviesContainer : styles.container}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={styles.text}>You will see your favorite movies here</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie!}
            onClose={() => setSelectedMovie(null)}
            token={token}
          />
          <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
            <View style={styles.scrollContainer}>
              {map(movies, (movie) => (
                <View style={styles.movieContainer} key={movie._id}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSelectedMovie(movie)}
                  >
                    <Image source={{ uri: getMovieWithChangedResolution(movie).img }} style={styles.image} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 25,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 230,
    shadowColor: '#00000070',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
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
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    textAlign: 'center',
    width: '90%',
  },
  noMoviesContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
});
