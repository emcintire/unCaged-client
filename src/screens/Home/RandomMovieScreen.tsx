import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, Text } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Movie, useCurrentUser, useMovies } from '@/services';
import { borderRadius, changeResolution, colors, fontFamily, fontSize, shadow, spacing } from '@/config';
import AdBanner from '@/components/AdBanner';
import MovieModal from '@/components/movieModal/MovieModal';
import RandomMovieFilters from '@/components/RandomMovieFilters';
import Screen from '@/components/Screen';

export default function RandomMovieScreen() {
  const [filtersModalVisible, setFiltersModalVisible] = useState(false);
  const [genreFilter, setGenreFilter] = useState('');
  const [mandyFilter, setMandyFilter] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [watchlistFilter, setWatchlistFilter] = useState(false);
  const [unseenFilter, setUnseenFilter] = useState(false);

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: allMovies = [], isLoading: isMoviesLoading } = useMovies();
  const isAdmin = user?.isAdmin ?? false;
  const isLoading = isUserLoading || isMoviesLoading;

  const getRandomMovie = useCallback(() => {
    try {
      if (!allMovies.length) {
        return;
      }

      const predicates = [
        (m: Movie) => !genreFilter || genreFilter === 'All' || m.genres.includes(genreFilter),
        (m: Movie) => !mandyFilter || m.title.toLowerCase().includes('mandy'),
        (m: Movie) => !unseenFilter || !user || !user.seen.includes(m._id),
        (m: Movie) => !watchlistFilter || !user || user.watchlist.includes(m._id),
      ];
      const matchesAll = (item: Movie) => predicates.every(p => p(item));

      const filtered = allMovies.filter(matchesAll);
      if (filtered.length === 0) {
        setMovie(null);
        return;
      }

      const candidateMovies = (movie && filtered.length > 1 && !mandyFilter)
        ? filtered.filter((m) => m._id !== movie._id)
        : filtered;

      const newMovie = candidateMovies[Math.floor(Math.random() * candidateMovies.length)];
      if (newMovie) {
        if (!newMovie.img) {
          console.warn('getRandomMovie: Movie has no img property', newMovie._id);
          setMovie(newMovie);
        } else {
          const movieToSet = newMovie.img.length === 32 ? changeResolution('', newMovie) : newMovie;
          setMovie(movieToSet);
        }
      }
    } catch (error) {
      console.error('getRandomMovie error:', error);
    }
  }, [genreFilter, mandyFilter, unseenFilter, watchlistFilter, movie, allMovies, user]);

  useEffect(() => {
    if (!isLoading && allMovies.length > 0) {
      getRandomMovie();
    }
  }, [isLoading, allMovies.length]);

  return (
    <Screen isLoading={isLoading} style={styles.container}>
      {!isAdmin && <AdBanner />}
      <MovieModal
        movie={movie}
        onClose={() => {
          setModalVisible(false);
        }}
        isOpen={modalVisible}
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
      <View style={styles.content}>
        {movie == null ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResults}>No results :(</Text>
          </View>
        ) : (
          <View style={styles.movieContainer}>
            <TouchableOpacity
              style={styles.movieButton}
              onPress={() => {
                setModalVisible(true);
              }}
            >
              <Image source={movie.img} style={styles.movieImage} contentFit="cover" />
              {user?.favorites.includes(movie._id) && (
                <View style={styles.badge}>
                  <MaterialCommunityIcons name="heart" size={18} color={colors.orange} />
                </View>
              )}
              {user?.seen.includes(movie._id) && (
                <View style={[styles.badge, user?.favorites.includes(movie._id) ? styles.secondBadge : undefined]}>
                  <MaterialCommunityIcons name="eye" size={18} color={colors.orange} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => {
            getRandomMovie();
          }}
        >
          <View style={styles.inner}>
            <Text style={styles.text}>CAGE ME</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtersBtn} onPress={() => setFiltersModalVisible(true)}>
          <MaterialCommunityIcons name="tune" color="grey" size={35} />
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.md,
  },
  content: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResults: {
    color: 'white',
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
    textAlign: 'center',
  },
  movieContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  movieButton: {
    width: '75%',
    maxHeight: '90%',
    aspectRatio: 2 / 3,
    ...shadow.lg,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  movieImage: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    width: '100%',
  },
  refreshBtn: {
    height: 60,
    width: 150,
    backgroundColor: '#976000',
    borderRadius: borderRadius.md,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 150,
    borderRadius: borderRadius.md,
    backgroundColor: colors.orange,
  },
  text: {
    fontSize: fontSize.xxl,
    fontFamily: fontFamily.black,
    color: 'white',
  },
  filtersBtn: {
    position: 'absolute',
    left: '50%',
    marginLeft: 75 + spacing.md,
    padding: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.black + 'CC',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondBadge: {
    right: 48,
  },
});
