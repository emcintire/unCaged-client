import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { filter, includes, map } from 'lodash';
import colors from '../../config/colors';
import { changeResolution } from '../../config/helperFunctions';
import type { Movie } from '../../types';
import { useMovies, useQuote, useAddQuote, useUser } from '../../api';

import Screen from '../../components/Screen';
import AppButton from '../../components/AppButton';
import MovieModal from '../../components/movieModal/MovieModal';

const styles = StyleSheet.create({
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

export default function HomeScreen() {
  const [newQuote, setNewQuote] = useState('');
  const [newSubQuote, setNewSubQuote] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: user } = useUser();
  const { data: movies = [], isLoading: moviesLoading } = useMovies();
  const { data: quote, isLoading: quoteLoading } = useQuote();
  const addQuoteMutation = useAddQuote();

  const isLoading = moviesLoading || quoteLoading;

  const submitQuote = () => {
    addQuoteMutation.mutate({
      quote: newQuote.trim(),
      subquote: newSubQuote.trim(),
    }, {
      onSuccess: () => {
        setNewQuote('');
        setNewSubQuote('');
      },
    });
  };

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  const getMoviesFromGenre = useCallback(
    (genre: string) => filter(movies, (movie) => includes(movie.genres, genre)),
    [movies],
  );

  return (
    <Screen isLoading={isLoading}>
      <MovieModal
        isOpen={selectedMovie != null}
        movie={selectedMovie!}
        onClose={() => setSelectedMovie(null)}
      />
      <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
        {user?.isAdmin && (
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
        <Text style={styles.quote}>{quote?.quote}</Text>
        <Text style={styles.subquote}>{quote?.subquote}</Text>
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
