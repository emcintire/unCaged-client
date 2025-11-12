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
      paddingTop: 15,
      width: '100%',
    },
    inputContainer: {
      alignItems: 'center',
      backgroundColor: colors.white,
      borderBottomEndRadius: open ? 0 : 25,
      borderBottomStartRadius: open ? 0 : 25,
      borderRadius: 25,
      flexDirection: 'row',
      height: 45,
      justifyContent: 'space-between',
      margin: 15,
      marginBottom: 0,
      paddingLeft: 20,
      paddingRight: 25,
      width: '92%',
    },
    text: {
      fontFamily: 'Montserrat-Regular',
      fontSize: 18,
      color: 'black',
      height: 40,
      width: '80%',
    },
    noResults: {
      color: 'white',
      fontFamily: 'Montserrat-Bold',
      fontSize: 30,
    },
    movieContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    button: {
      width: 150,
      height: 230,
      shadowColor: '#00000060',
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
                  style={styles.button}
                  onPress={() => setSelectedMovie(movie)}
                >
                  <Image
                    source={{ uri: getMovieWithChangedResolution(movie).img }}
                    style={styles.image}
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
