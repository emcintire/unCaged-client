import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Image, Modal, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { filter, overEvery, sample, reject, includes } from 'lodash';
import type { Movie } from '../../api';
import Screen from '../../components/Screen';
import colors from '../../config/colors';
import AdBanner from '../../components/AdBanner';
import MovieModal from '../../components/movieModal/MovieModal';
import RandomMovieFilters from '../../components/RandomMovieFilters';
import { useCurrentUser } from '../../api/controllers/users.controller';
import { useMovies } from '../../api/controllers/movies.controller';
import { shadow, spacing, borderRadius, fontSize, fontFamily } from '../../config/theme';

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
    if (!allMovies.length) return;
    
    const predicates = overEvery<Movie>([
      (m) => !genreFilter || includes(m.genres, genreFilter),
      (m) => !mandyFilter || m.title.toLowerCase().includes('mandy'),
      (m) => !unseenFilter || !user || !includes(user.seen, m._id),
      (m) => !watchlistFilter || !user || includes(user.watchlist, m._id),
    ]) as (movie: Movie) => boolean;
    
    const filtered = filter(allMovies, predicates);

    if (filtered.length === 0) {
      setMovie(null);
      return;
    }

    const candidateMovies = (movie && filtered.length > 1 && !mandyFilter)
      ? reject(filtered, (m) => m._id === movie._id)
      : filtered;

    const newMovie = sample(candidateMovies);
    if (newMovie) {
      setMovie(newMovie);
    }
  }, [genreFilter, mandyFilter, unseenFilter, watchlistFilter, movie, allMovies, user]);

  useEffect(() => {
    if (!isLoading && allMovies.length > 0) {
      getRandomMovie();
    }
  }, [isLoading, allMovies.length]);

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
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.refreshBtn} onPress={getRandomMovie}>
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
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  movieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    width: '85%',
    maxWidth: 400,
    aspectRatio: 2 / 3,
    ...shadow.lg,
    borderRadius: borderRadius.sm,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  refreshBtn: {
    height: 60,
    width: 150,
    backgroundColor: '#976000',
    borderRadius: borderRadius.md,
    padding: 0,
    marginVertical: spacing.sm,
  },
  noResults: {
    color: 'white',
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xxxl,
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
    right: -50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: -25,
  },
});
