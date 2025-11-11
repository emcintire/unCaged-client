import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet, View, Image, Text, TouchableOpacity, TextInput, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { filter, includes, map } from 'lodash';

import Screen from '../components/Screen';
import colors from '../config/colors';
import MovieModal from '../components/movieModal/MovieModal';
import Loading from '../components/Loading';
import { changeResolution, showErrorToast } from '../config/helperFunctions';
import { Movie, SetState } from '../types';

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

const fetchData = async (
  setMovies: SetState<Array<Movie>>,
  setToken: SetState<string>,
  setLoading: SetState<boolean>,
) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token == null) { return; }
    const response = await fetch('https://uncaged-server.herokuapp.com/api/movies/getMovies', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        category: 'title',
        direction: 1,
      }),
    });

    const body = await response.json();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      setMovies(body);
      setToken(token);
      setLoading(false);
    }
  } catch (err) {
    console.log(err);
  }
};

const handleInputChange = async (
  title: string,
  selected: string,
  ratingUp: boolean,
  yearUp: boolean,
  abc: boolean,
  setMovies: SetState<Array<Movie>>,
  setTitle: SetState<string>
) => {
  setTitle(title);
  await handleSubmit(title, selected, ratingUp, yearUp, abc, setMovies);
};

const handleSubmit = async (
  title: string,
  selected: string,
  ratingUp: boolean,
  yearUp: boolean,
  abc: boolean,
  setMovies: SetState<Array<Movie>>
) => {
  let direction = 1;
  let category = 'avgRating';

  switch (selected) {
    case 'rating': {
      direction = ratingUp ? 1 : -1;
      category = 'avgRating';
      break;
    }
    case 'year': {
      direction = yearUp ? 1 : -1;
      category = 'date';
      break;
    }
    case 'az': {
      direction = abc ? 1 : -1;
      category = 'title';
      break;
    }
    case 'za': {
      direction = -1;
      category = 'title';
      break;
    }
  }

  const response = await fetch('https://uncaged-server.herokuapp.com/api/movies/findByTitle', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      category,
      direction,
      title,
    }),
  });
  const body = await response.json();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    setMovies(body);
  }
};

export default function SearchScreen() {
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [ratingUp, setRatingUp] = useState(false);
  const [yearUp, setYearUp] = useState(false);
  const [abc, setAbc] = useState(true);
  const [movies, setMovies] = useState<Array<Movie>>([]);
  const [token, setToken] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [selected, setSelected] = useState('az');
  const [genre, setGenre] = useState('Genre');
  const [genresVisible, setGenresVisible] = useState(false);

  useEffect(() => {
    fetchData(setMovies, setToken, setLoading);
  }, []);

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
        token={token}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.text}
          placeholder="Enter title"
          placeholderTextColor={colors.medium}
          onChangeText={(text) =>
            handleInputChange(text, selected, ratingUp, yearUp, abc, setMovies, setTitle)
          }
          onSubmitEditing={() => handleSubmit(title, selected, ratingUp, yearUp, abc, setMovies)}
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
                if (selected === 'rating') {
                  handleSubmit(title, 'rating', !ratingUp, yearUp, abc, setMovies);
                  setRatingUp(!ratingUp);
                } else {
                  handleSubmit(title, 'rating', ratingUp, yearUp, abc, setMovies);
                }
                setSelected('rating');
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
                if (selected === 'year') {
                  handleSubmit(title, 'year', ratingUp, !yearUp, abc, setMovies);
                  setYearUp(!yearUp);
                } else {
                  handleSubmit(title, 'year', ratingUp, yearUp, abc, setMovies);
                }
                setSelected('year');
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
                if (selected === 'az') {
                  handleSubmit(title, 'az', ratingUp, yearUp, !abc, setMovies);
                  setAbc(!abc);
                } else {
                  handleSubmit(title, 'az', ratingUp, yearUp, abc, setMovies);
                }
                setSelected('az');
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
                {map(genres, (genre, index) => (
                  <View key={index}>
                    <TouchableOpacity
                      style={styles.genreBtn}
                      onPress={() => {
                        setGenre(genre);
                        setGenresVisible(false);
                      }}
                    >
                      <Text style={styles.genreLabel}>{genre}</Text>
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
