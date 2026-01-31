import { useCallback, useState, useMemo, useRef } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { map, filter, overEvery, orderBy, some, debounce, toLower, includes } from 'lodash';
import { type Movie, useMovies } from '@/services';
import { changeResolution, colors, spacing, borderRadius, fontSize, fontFamily, movieCard } from '@/config';
import Loading from '@/components/Loading';
import MovieModal from '@/components/movieModal/MovieModal';
import Screen from '@/components/Screen';
import SearchFilters from '@/components/SearchFilters';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

export default function SearchScreen() {
  const [open, setOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [debouncedTitle, setDebouncedTitle] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selected, setSelected] = useState('az');
  const [genre, setGenre] = useState('Genre');
  const [genresVisible, setGenresVisible] = useState(false);
  
  const { data: movies = [], isLoading: loading } = useMovies();

  // Debounce search input using lodash
  const debouncedSetTitle = useRef(
    debounce((value: string) => {
      setDebouncedTitle(value);
    }, 300)
  ).current;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    debouncedSetTitle(value);
  };

  const displayMovies = useMemo(() => {
    const predicates = overEvery<Movie>([
      (movie) => !debouncedTitle || includes(toLower(movie.title), toLower(debouncedTitle)),
      (movie) => genre === 'Genre' || some(movie.genres, (g: string) => toLower(g) === toLower(genre)),
    ]) as (movie: Movie) => boolean;
    
    const filtered = filter(movies, predicates);
    
    // Sort based on selected criteria
    const sortKey: (movie: Movie) => string | number = selected === 'rating' 
      ? (movie: Movie) => movie.avgRating || 0
        : selected === 'year'
      ? (movie: Movie) => new Date(movie.date).getFullYear()
        : (movie: Movie) => toLower(movie.title);
    
    return orderBy(filtered, sortKey, sortDirection);
  }, [genre, movies, selected, sortDirection, debouncedTitle]);

  const styles = StyleSheet.create({
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
      paddingHorizontal: spacing.lg,
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
    filtersBtn: {
      alignSelf: 'flex-end',
    },
  });

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen>
      <MovieModal
        isOpen={selectedMovie != null}
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
      <View style={styles.inputContainer}>
        <TextInput
          onChangeText={handleTitleChange}
          value={title}
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
        <ScrollView decelerationRate="fast" showsVerticalScrollIndicator={false}>
          <View style={movieCard.scrollContainer}>
            {map(displayMovies, (movie) => (
              <View style={movieCard.container} key={movie._id}>
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
            <BuyMeCoffeeButton />
          </View>
        </ScrollView>
      ) : (
        <View style={{ ...movieCard.scrollContainer, flex: 1 }}>
          <Text style={styles.noResults}>No results :(</Text>
          <BuyMeCoffeeButton />
        </View>
      ))}
    </Screen>
  );
}
