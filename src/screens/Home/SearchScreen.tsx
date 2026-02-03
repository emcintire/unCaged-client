import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { type Movie, useMovies } from '@/services';
import { changeResolution, colors, spacing, borderRadius, fontSize, fontFamily, movieCard } from '@/config';
import MovieGridSkeleton from '@/components/MovieGridSkeleton';
import MovieModal from '@/components/movieModal/MovieModal';
import Screen from '@/components/Screen';
import SearchFilters from '@/components/SearchFilters';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const styles = StyleSheet.create({
  inputContainer: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.round,
    flexDirection: 'row',
    height: 45,
    justifyContent: 'space-between',
    margin: spacing.md,
    marginBottom: 0,
    paddingHorizontal: spacing.lg,
    width: '92%',
  },
  inputContainerOpen: {
    borderBottomEndRadius: 0,
    borderBottomStartRadius: 0,
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
  noResultsContainer: {
    ...movieCard.scrollContainer,
    flex: 1,
  },
  filtersBtn: {
    alignSelf: 'flex-end',
  },
  filtersTouchable: {
    width: 50,
  },
});

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

  // Debounce search input using setTimeout
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      setDebouncedTitle(value);
    }, 300);
  };

  const displayMovies = useMemo(() => {
    const predicates = [
      (movie: Movie) => !debouncedTitle || movie.title.toLowerCase().includes(debouncedTitle.toLowerCase()),
      (movie: Movie) => genre === 'Genre' || movie.genres.some((g: string) => g.toLowerCase() === genre.toLowerCase()),
    ];

    const filtered = movies.filter((movie: Movie) => predicates.every(p => p(movie)));

    // Sort based on selected criteria
    const sortKey: (movie: Movie) => string | number = selected === 'rating'
      ? (movie: Movie) => movie.avgRating || 0
        : selected === 'year'
      ? (movie: Movie) => new Date(movie.date).getFullYear()
        : (movie: Movie) => movie.title.toLowerCase();

    return [...filtered].sort((a, b) => {
      const aVal = sortKey(a);
      const bVal = sortKey(b);
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [genre, movies, selected, sortDirection, debouncedTitle]);

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen>
      <MovieModal
        isOpen={selectedMovie != null}
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
      <View style={[styles.inputContainer, open && styles.inputContainerOpen]}>
        <TextInput
          onChangeText={handleTitleChange}
          value={title}
          placeholder="Enter title"
          placeholderTextColor={colors.medium}
          style={styles.text}
        />
        <TouchableOpacity style={styles.filtersTouchable} onPress={() => setOpen(!open)}>
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
      {loading ? <MovieGridSkeleton /> : (displayMovies.length > 0 ? (
        <ScrollView decelerationRate="fast" showsVerticalScrollIndicator={false}>
          <View style={movieCard.scrollContainer}>
            {displayMovies.map((movie) => (
              <View style={movieCard.container} key={movie._id}>
                <TouchableOpacity
                  style={movieCard.button}
                  onPress={() => setSelectedMovie(movie)}
                >
                  <Image
                    source={getMovieWithChangedResolution(movie).img}
                    style={movieCard.image}
                  />
                </TouchableOpacity>
              </View>
            ))}
            <BuyMeCoffeeButton />
          </View>
        </ScrollView>
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResults}>No results :(</Text>
          <BuyMeCoffeeButton />
        </View>
      ))}
    </Screen>
  );
}
