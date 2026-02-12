import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { ScrollView } from 'react-native-gesture-handler';
import { type Movie, useMovies, useQuote } from '@/services';
import { colors, changeResolution, spacing, fontSize, fontFamily, movieCard } from '@/config';
import Screen from '@/components/Screen';
import MovieModal from '@/components/movieModal/MovieModal';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

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
  scrollContent: {
    marginLeft: 15,
  },
  listSpacer: {
    width: 20,
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
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: movies = [], isLoading: moviesLoading } = useMovies();
  const { data: quote, isLoading: quoteLoading } = useQuote();

  const isLoading = moviesLoading || quoteLoading;

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  const getMoviesFromGenre = useCallback(
    (genre: string) => movies.filter((movie) => movie.genres.includes(genre)),
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
        <Text style={styles.quote}>{quote?.quote}</Text>
        <Text style={styles.subquote}>{quote?.subquote}</Text>
        <Text style={styles.subsubquote}>Verse of the Week</Text>
        {genres.map((genre) => (
          <View key={genre}>
            <Text style={styles.header}>{genre}</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              decelerationRate="fast"
              contentContainerStyle={styles.scrollContent}
            >
              {getMoviesFromGenre(genre).map((movie) => (
                <TouchableOpacity
                  style={styles.button}
                  key={`${genre}-${movie._id}`}
                  onPress={() => setSelectedMovie(movie)}
                >
                  <Image source={getMovieWithChangedResolution(movie).img} style={movieCard.image} />
                </TouchableOpacity>
              ))}
              <View style={styles.listSpacer} />
            </ScrollView>
          </View>
        ))}
        <BuyMeCoffeeButton />
      </ScrollView>
    </Screen>
  );
}
