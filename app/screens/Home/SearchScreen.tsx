import React, { useCallback, useState, useEffect } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { filter, includes, map } from 'lodash';

import Screen from '../../components/Screen';
import colors from '../../config/colors';
import MovieModal from '../../components/movieModal/MovieModal';
import Loading from '../../components/Loading';
import { changeResolution } from '../../config/helperFunctions';
import { Movie } from '../../types';
import { useMovies } from '../../api/controllers/movies.controller';

const genres = [
  'Genre',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
];

export default function SearchScreen() {
  const [open, setOpen] = useState(false);
  const [ratingUp, setRatingUp] = useState(false);
  const [yearUp, setYearUp] = useState(false);
  const [abc, setAbc] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState('az');
  const [genre, setGenre] = useState('Genre');
  const [genresVisible, setGenresVisible] = useState(false);
  
  const { data: allMovies = [], isLoading: loading } = useMovies();
  const [movies, setMovies] = useState<Array<Movie>>([]);
  
  useEffect(() => {
    // Initialize movies with all movies sorted by title
    if (allMovies.length > 0) {
      const sorted = [...allMovies].sort((a, b) => a.title.localeCompare(b.title));
      setMovies(sorted);
    }
  }, [allMovies]);

  const handleInputChange = (text: string) => {
    setTitle(text);
    handleFilter(text, selected, ratingUp, yearUp, abc, genre);
  };

  const handleFilter = (
    searchTitle: string,
    sortSelected: string,
    isRatingUp: boolean,
    isYearUp: boolean,
    isAbc: boolean,
    selectedGenre: string
  ) => {
    let filtered = [...allMovies];
    
    // Filter by title
    if (searchTitle) {
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre && selectedGenre !== 'Genre') {
      filtered = filtered.filter(movie => 
        movie.genres.some((g: string) => g.toLowerCase() === selectedGenre.toLowerCase())
      );
    }
    
    // Sort
    switch (sortSelected) {
      case 'rating': {
        filtered.sort((a, b) => {
          const ratingA = a.avgRating || 0;
          const ratingB = b.avgRating || 0;
          return isRatingUp ? ratingA - ratingB : ratingB - ratingA;
        });
        break;
      }
      case 'year': {
        filtered.sort((a, b) => {
          const yearA = new Date(a.date).getFullYear();
          const yearB = new Date(b.date).getFullYear();
          return isYearUp ? yearA - yearB : yearB - yearA;
        });
        break;
      }
      case 'az': {
        filtered.sort((a, b) => {
          return isAbc 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        });
        break;
      }
    }
    
    setMovies(filtered);
  };

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
    underSearchContainer: {
      width: '92%',
      zIndex: 999,
    },
    sortContainer: {
      backgroundColor: colors.dark,
      borderRadius: 25,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      flexDirection: 'row',
      height: 45,
      width: '100%',
      alignItems: 'center',
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
    label: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 15,
      color: colors.white,
    },
    gLabel: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 15,
      color: genre === 'Genre' ? colors.white : colors.orange,
    },
    ratingBtn: {
      width: '25%',
      height: '100%',
      borderBottomLeftRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: selected === 'rating' ? colors.orange : colors.black,
    },
    yearBtn: {
      width: '25%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      backgroundColor: selected === 'year' ? colors.orange : colors.black,
    },
    azBtn: {
      width: '25%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      backgroundColor: selected === 'az' ? colors.orange : colors.black,
    },
    scrollContainer: {
      width: '25%',
      height: 150,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      position: 'absolute',
      right: 0,
      top: 45,
    },
    androidScrollContainer: {
      width: '25%',
      height: 150,
      marginBottom: 10,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      alignSelf: 'flex-end',
    },
    genresBtn: {
      width: '25%',
      height: '100%',
      borderBottomRightRadius: genresVisible ? 0 : 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      backgroundColor: selected === 'za' ? colors.orange : colors.black,
    },
    genreBtn: {
      width: '100%',
      height: 40,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    genreLabel: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 15,
      color: 'black',
      alignSelf: 'center',
    },
    separator: {
      height: 1,
      width: '90%',
      backgroundColor: colors.light,
      alignSelf: 'center',
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
          onChangeText={handleInputChange}
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
      {open ? (
        <View style={styles.underSearchContainer}>
          <View style={styles.sortContainer}>
            <TouchableOpacity
              onPress={() => {
                const newRatingUp = selected === 'rating' ? !ratingUp : ratingUp;
                setRatingUp(newRatingUp);
                setSelected('rating');
                handleFilter(title, 'rating', newRatingUp, yearUp, abc, genre);
              }}
              style={styles.ratingBtn}
            >
              <Text style={styles.label}>Rating</Text>
              <MaterialCommunityIcons
                name={ratingUp ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newYearUp = selected === 'year' ? !yearUp : yearUp;
                setYearUp(newYearUp);
                setSelected('year');
                handleFilter(title, 'year', ratingUp, newYearUp, abc, genre);
              }}
              style={styles.yearBtn}
            >
              <Text style={styles.label}>Year</Text>
              <MaterialCommunityIcons
                name={yearUp ? 'arrow-up' : 'arrow-down'}
                size={20}
                color={colors.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                const newAbc = selected === 'az' ? !abc : abc;
                setAbc(newAbc);
                setSelected('az');
                handleFilter(title, 'az', ratingUp, yearUp, newAbc, genre);
              }}
              style={styles.azBtn}
            >
              {abc ? (
                <Text style={styles.label}>A - Z</Text>
              ) : (
                <Text style={styles.label}>Z - A</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGenresVisible(!genresVisible)}
              style={styles.genresBtn}
            >
              <Text style={styles.gLabel}>{genre}</Text>
            </TouchableOpacity>
          </View>
          {genresVisible ? (
            <View
              style={Platform.OS === 'ios' ? styles.scrollContainer : styles.androidScrollContainer}
            >
              <ScrollView decelerationRate="fast">
                {map(genres, (genreItem, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.genreBtn}
                      onPress={() => {
                        setGenre(genreItem);
                        setGenresVisible(false);
                        handleFilter(title, selected, ratingUp, yearUp, abc, genreItem);
                      }}
                    >
                      <Text style={styles.genreLabel}>{genreItem}</Text>
                    </TouchableOpacity>
                    <View style={genre === 'Fantasy' ? {} : styles.separator} />
                  </View>
                ))}
              </ScrollView>
            </View>
          ) : null}
        </View>
      ) : null}

      {!loading ? (movies.length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
            contentContainerStyle={{ width: '100%' }}
          >
            <View style={styles.scrollView}>
              {map(filter(movies, (m) => genre !== 'Genre' || includes(m.genres, genre)), (movie) => (
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
