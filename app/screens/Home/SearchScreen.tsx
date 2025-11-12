import { useCallback, useState, useMemo } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { map, filter, overEvery, orderBy, some } from 'lodash';

import Screen from '../../components/Screen';
import colors from '../../config/colors';
import MovieModal from '../../components/movieModal/MovieModal';
import Loading from '../../components/Loading';
import { changeResolution } from '../../config/helperFunctions';
import { useMovies } from '../../api/controllers/movies.controller';
import SearchFilters from '../../components/SearchFilters';
import { Movie } from '../../api';

export default function SearchScreen() {
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [ratingUp, setRatingUp] = useState(false);
  const [yearUp, setYearUp] = useState(false);
  const [abc, setAbc] = useState(true);
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
    
    const sortDirection: 'asc' | 'desc' = selected === 'rating'
      ? (ratingUp ? 'asc' : 'desc')
      : selected === 'year'
      ? (yearUp ? 'asc' : 'desc')
      : (abc ? 'asc' : 'desc');
    
    return orderBy(filtered, sortKey, sortDirection);
  }, [movies, title, genre, selected, ratingUp, yearUp, abc]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.bg,
      height: '100%',
      width: '100%',
      alignItems: 'center',
      paddingTop: 0,
    },
    scrollView: {
      flexDirection: 'row',
      flex: 1,
      flexWrap: 'wrap',
      paddingTop: 15,
      width: '100%',
      justifyContent: 'space-evenly',
    },
    inputContainer: {
      backgroundColor: colors.white,
      borderRadius: 25,
      borderBottomEndRadius: open ? 0 : 25,
      borderBottomStartRadius: open ? 0 : 25,
      flexDirection: 'row',
      height: 45,
      width: '92%',
      paddingLeft: 20,
      paddingRight: 25,
      margin: 15,
      marginBottom: 0,
      alignItems: 'center',
      justifyContent: 'space-between',
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
          style={styles.text}
          placeholder="Enter title"
          placeholderTextColor={colors.medium}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={{ width: 50 }} onPress={() => setOpen(!open)}>
          <MaterialCommunityIcons
            name="tune"
            size={30}
            color={colors.medium}
            style={styles.filtersBtn}
          />
        </TouchableOpacity>
      </View>
      {open && (
        <SearchFilters
          abc={abc}
          genre={genre}
          genresVisible={genresVisible}
          ratingUp={ratingUp}
          selected={selected}
          setAbc={setAbc}
          setGenre={setGenre}
          setGenresVisible={setGenresVisible}
          setRatingUp={setRatingUp}
          setSelected={setSelected}
          setYearUp={setYearUp}
          yearUp={yearUp}
        />
      )}

      {!loading ? (displayMovies.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={{ width: '100%' }}
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
        )
      ) : (
        <Loading />
      )}
    </Screen>
  );
}
