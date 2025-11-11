import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../config/colors';
import { changeResolution, showErrorToast } from '../config/helperFunctions';
import type { Movie } from '../types';

import Screen from '../components/Screen';
import AppButton from '../components/AppButton';
import MovieModal from '../components/movieModal/MovieModal';
import { filter, includes, map } from 'lodash';

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
  },
  quote: {
    fontFamily: 'Montserrat-ExtraLight',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  subquote: {
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  subsubquote: {
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Montserrat-ExtraLight',
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 25,
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
  button: {
    marginRight: 10,
    width: 135,
    height: 200,
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
  tagline: {
    marginTop: 10,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: colors.white,
    alignSelf: 'center',
  },
  subTagline: {
    fontFamily: 'Montserrat-Light',
    fontSize: 13,
    color: colors.white,
    alignSelf: 'flex-start',
  },
  quoteInput: {
    width: '90%',
    borderRadius: 25,
    fontSize: 18,
    backgroundColor: colors.black,
    color: colors.white,
    alignSelf: 'center',
    padding: 10,
    margin: 10,
  },
  quoteSubmit: {
    width: '50%',
    alignSelf: 'center',
  },
});

const genres = [
  'Popular',
  'Thriller',
  'Drama',
  'Action',
  'Comedy',
  'Family',
  'Romance',
  'Horror',
  'Crime',
  'War',
  'Mystery',
  'Documentary',
  'Sci-Fi',
  'Fantasy',
];

type Quote = {
  quote: string;
  subquote: string;
};

const getMovies = async (token: string, setMovies: (movies: Array<Movie>) => void): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/movies/getMovies', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  const body = await response.json();

  if (response.status !== 200) {
    showErrorToast(body);
    return;
  }

  setMovies(body);
};

const getQuote = async (token: string, setQuote: (quote: Quote) => void): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/movies/quote', {
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

  setQuote(body[0] ?? body);
};

const getUser = async (token: string, setIsAdmin: (isAdmin: boolean) => void): Promise<void> => {
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

  setIsAdmin(body?._id === '61857ba3f07dd937dcaf6a1e');
};

const fetchData = async (
  setMovies: (movies: Array<Movie>) => void,
  setQuote: (quote: Quote) => void,
  setIsAdmin: (isAdmin: boolean) => void,
  setToken: (token: string) => void,
  setIsLoading: (isLoaded: boolean) => void
): Promise<void> => {
  const token = await AsyncStorage.getItem('token');
  if (!token) {
    return;
  }

  setToken(token);
  await Promise.all([
    getMovies(token, setMovies),
    getQuote(token, setQuote),
    getUser(token, setIsAdmin),
  ]);
  setIsLoading(false);
};

export default function HomeScreen() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [newQuote, setNewQuote] = useState('');
  const [newSubQuote, setNewSubQuote] = useState('');
  const [quote, setQuote] = useState<Quote>({ quote: '', subquote: '' });
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchData(setMovies, setQuote, setIsAdmin, setToken, setIsLoading);
  }, []);

  const submitQuote = async () => {
    const response = await fetch('https://uncaged-server.herokuapp.com/api/movies/quote', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify({
        quote: newQuote.trim(),
        subquote: newSubQuote.trim(),
      }),
    });
    const body = await response.text();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      setQuote(JSON.parse(body));
    }
  };

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  const getMoviesFromGenre = useCallback(
    (genre: string) => filter(movies, (movie) => includes(movie.genres, genre)),
    [movies],
  );

  return (
    <Screen isLoading={isLoading} style={styles.container}>
      <MovieModal
        isOpen={selectedMovie != null}
        movie={selectedMovie!}
        onClose={() => setSelectedMovie(null)}
        token={token}
      />
      <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
        {isAdmin && (
          <View>
            <TextInput
              style={styles.quoteInput}
              placeholder="Enter title"
              placeholderTextColor={colors.medium}
              onChangeText={(text) => setNewQuote(text)}
            />
            <TextInput
              style={styles.quoteInput}
              placeholder="Enter sub title"
              placeholderTextColor={colors.medium}
              onChangeText={(text) => setNewSubQuote(text)}
            />
            <AppButton onPress={submitQuote} style={styles.quoteSubmit} title="Submit" />
          </View>
        )}
        <Text style={styles.quote}>{quote.quote}</Text>
        <Text style={styles.subquote}>{quote.subquote}</Text>
        <Text style={styles.subsubquote}>Verse of the Week</Text>
        {map(genres, (genre) => (
          <View key={genre}>
            <Text style={styles.header}>{genre}</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              decelerationRate="fast"
              contentContainerStyle={{ marginLeft: 15 }}
            >
              {map(getMoviesFromGenre(genre), (movie) => (
                <TouchableOpacity
                  style={styles.button}
                  key={`${genre}-${movie._id}`}
                  onPress={() => setSelectedMovie(movie)}
                >
                  <Image source={{ uri: getMovieWithChangedResolution(movie).img }} style={styles.image} />
                </TouchableOpacity>
              ))}
              <View style={{ width: 20 }} />
            </ScrollView>
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}
