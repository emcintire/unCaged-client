import { useCallback, useState, useMemo } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { map, filter, overEvery, orderBy, some } from 'lodash';
import type { Movie } from '../../api';
import { useMovies } from '../../api/controllers/movies.controller';
import { changeResolution } from '../../config/helperFunctions';
import colors from '../../config/colors';
import Loading from '../../components/Loading';
import MovieModal from '../../components/movieModal/MovieModal';
import Screen from '../../components/Screen';
import SearchFilters from '../../components/SearchFilters';
import { spacing, borderRadius, fontSize, fontFamily, movieCard } from '../../config/theme';

export default function SearchScreen() {
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState('az');
  const [genre, setGenre] = useState('Genre');
  const [genresVisible, setGenresVisible] = useState(false);
  
  const { data: movies = [], isLoading: loading } = useMovies();

  const displayMovies = useMemo(() => {
    const predicates = overEvery<Movie>([
      (movie) => !title || movie.title.toLowerCase().includes(title.toLowerCase()),
      (movie) => genre === 'Genre' || some(movie.genres, (g: string) => g.toLowerCase() === genre.toLowerCase()),
    ]) as (movie: Movie) => boolean;
    
    const filtered = filter(movies, predicates);
    
    // Sort based on selected criteria
    const sortKey: (movie: Movie) => string | number = selected === 'rating' 
      ? (movie: Movie) => movie.avgRating || 0
        : selected === 'year'
      ? (movie: Movie) => new Date(movie.date).getFullYear()
        : (movie: Movie) => movie.title.toLowerCase();
    
    return orderBy(filtered, sortKey, sortDirection);
  }, [genre, movies, selected, sortDirection, title]);

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    scrollView: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      paddingTop: spacing.md,
      width: '100%',
    },
    inputContainer: {
      alignItems: 'center',
      backgroundColor: colors.white,
      borderBottomEndRadius: open ? 0 : borderRadius.round,
      borderBottomStartRadius: open ? 0 : borderRadius.round,
      borderRadius: borderRadius.round,
      flexDirection: 'row',
      height: 45,
      justifyContent: 'space-between',
      margin: spacing.md,
      marginBottom: 0,
      paddingLeft: spacing.lg,
      paddingRight: borderRadius.round,
      width: '92%',
    },
    text: {
      fontFamily: fontFamily.regular,
      fontSize: fontSize.lg,
      color: 'black',
      height: 40,
      width: '80%',
    },
    noResults: {
      color: 'white',
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xxxl,
    },
    movieContainer: {
      alignItems: 'center',
      marginBottom: spacing.xxl,
    },
    filtersBtn: {
      alignSelf: 'flex-end',
    },
  });

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen style={styles.container}>
      <MovieModal
        isOpen={selectedMovie !== null}
        movie={selectedMovie!}
        onClose={() => setSelectedMovie(null)}
      />
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor={colors.medium}
          style={styles.text}
        />
        <TouchableOpacity style={{ width: 50 }} onPress={() => setOpen(!open)}>
          <MaterialCommunityIcons
            color={colors.medium}
            name="tune"
            size={30}
            style={styles.filtersBtn}
          />
        </TouchableOpacity>
      </View>
      {open && (
        <SearchFilters
          genre={genre}
          genresVisible={genresVisible}
          selected={selected}
          setGenre={setGenre}
          setGenresVisible={setGenresVisible}
          setSelected={setSelected}
          setSortDirection={setSortDirection}
          sortDirection={sortDirection}
        />
      )}
      {loading ? <Loading /> : (displayMovies.length > 0 ? (
        <ScrollView
          contentContainerStyle={{ width: '100%' }}
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scrollView}>
            {map(displayMovies, (movie) => (
              <View style={styles.movieContainer} key={movie._id}>
                <TouchableOpacity
                  style={movieCard.button}
                  onPress={() => setSelectedMovie(movie)}
                >
                  <Image
                    source={{ uri: getMovieWithChangedResolution(movie).img }}
                    style={movieCard.image}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={{ height: '80%', justifyContent: 'center' }}>
          <Text style={styles.noResults}>No results :(</Text>
        </View>
      ))}
    </Screen>
  );
}
