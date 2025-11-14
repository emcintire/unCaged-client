import { useState, useCallback } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, TextInput } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { filter, includes, map } from 'lodash';
import { type Movie, useMovies, useQuote, useAddQuote, useCurrentUser } from '@/services';
import { colors, changeResolution, spacing, borderRadius, fontSize, fontFamily, movieCard } from '@/config';
import Screen from '@/components/Screen';
import AppButton from '@/components/AppButton';
import MovieModal from '@/components/movieModal/MovieModal';

const styles = StyleSheet.create({
  quote: {
    fontFamily: fontFamily.extraLight,
    fontSize: fontSize.xxxl - 2,
    color: 'white',
    textAlign: 'center',
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.sm,
  },
  subquote: {
    marginTop: spacing.xs + 3,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    color: 'white',
    textAlign: 'center',
  },
  subsubquote: {
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    fontFamily: fontFamily.extraLight,
    fontSize: fontSize.xs,
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.xxl,
    color: 'white',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.md,
  },
  button: {
    marginRight: spacing.sm,
    width: 135,
    height: 200,
  },
  tagline: {
    marginTop: spacing.sm,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    color: colors.white,
    alignSelf: 'center',
  },
  subTagline: {
    fontFamily: fontFamily.light,
    fontSize: fontSize.sm - 1,
    color: colors.white,
    alignSelf: 'flex-start',
  },
  quoteInput: {
    width: '90%',
    borderRadius: borderRadius.round,
    fontSize: fontSize.lg,
    backgroundColor: colors.black,
    color: colors.white,
    alignSelf: 'center',
    padding: spacing.sm,
    margin: spacing.sm,
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

  const { data: user } = useCurrentUser();
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
        movie={selectedMovie}
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
                  <Image source={{ uri: getMovieWithChangedResolution(movie).img }} style={movieCard.image} />
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
