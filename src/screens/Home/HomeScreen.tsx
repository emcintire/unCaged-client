import { useState, useCallback, useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { type Movie, useCurrentUser, useMovies, usePopularMovies, useStaffPicks, useQuote } from '@/services';
import { colors, spacing, fontSize, fontFamily } from '@/config';
import Screen from '@/components/Screen';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/movieModal/MovieModal';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';
import HomeScreenSkeleton from './HomeScreenSkeleton';

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

  const { data: user } = useCurrentUser();
  const { data: movies = [], isLoading: moviesLoading } = useMovies();
  const { data: popularMovies = [], isLoading: popularLoading } = usePopularMovies();
  const { data: staffPicks = [], isLoading: staffPicksLoading } = useStaffPicks();
  const { data: quote, isLoading: quoteLoading } = useQuote();

  const isLoading = moviesLoading || popularLoading || staffPicksLoading || quoteLoading;

  const favoriteIds = useMemo(() => new Set(user?.favorites ?? []), [user?.favorites]);
  const seenIds = useMemo(() => new Set(user?.seen ?? []), [user?.seen]);

  const getMoviesFromGenre = useCallback(
    (genre: string) => movies.filter((movie) => movie.genres.includes(genre)),
    [movies],
  );

  const customRows = useMemo(
    () => [{ label: 'Popular', data: popularMovies }, { label: 'Staff Picks', data: staffPicks }],
    [popularMovies, staffPicks],
  );

  return (
    <Screen isLoading={isLoading} skeleton={<HomeScreenSkeleton />}>
      <MovieModal
        isOpen={selectedMovie != null}
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
      <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
        <Text style={styles.quote}>{quote?.quote}</Text>
        <Text style={styles.subquote}>{quote?.subquote}</Text>
        <Text style={styles.subsubquote}>Verse of the Week</Text>
        {customRows.map(({ label, data }) => (
          <View key={label}>
            <Text style={styles.header}>{label}</Text>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={200}
              decelerationRate="fast"
              contentContainerStyle={styles.scrollContent}
            >
              {data.map((movie) => (
                <MovieCard
                  key={`${label}-${movie._id}`}
                  movie={movie}
                  onPress={() => setSelectedMovie(movie)}
                  isFavorite={favoriteIds.has(movie._id)}
                  isSeen={seenIds.has(movie._id)}
                  buttonStyle={styles.button}
                />
              ))}
              <View style={styles.listSpacer} />
            </ScrollView>
          </View>
        ))}
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
                <MovieCard
                  key={`${genre}-${movie._id}`}
                  movie={movie}
                  onPress={() => setSelectedMovie(movie)}
                  isFavorite={favoriteIds.has(movie._id)}
                  isSeen={seenIds.has(movie._id)}
                  buttonStyle={styles.button}
                />
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
