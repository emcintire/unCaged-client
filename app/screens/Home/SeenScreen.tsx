import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';

import { changeResolution } from '../../config/helperFunctions';
import Screen from '../../components/Screen';
import colors from '../../config/colors';
import MovieModal from '../../components/movieModal/MovieModal';
import { Movie } from '../../types';
import { useSeen } from '../../api/controllers/users.controller';

export default function SeenScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: movies = [], isLoading } = useSeen();

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? styles.noMoviesContainer : styles.container}>
      {movies.length === 0 ? (
        <Text style={styles.text}>What are you doing here... go watch a Nicolas Cage movie</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie !== null}
            movie={selectedMovie!}
            onClose={() => setSelectedMovie(null)}
          />
          <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
            <View>
              <Text style={styles.header}>
                You've seen
                <Text style={styles.number}> {movies.length}</Text>{' '}
              </Text>
              <Text style={styles.subHeader}>
                {movies.length === 1 ? 'cinematic masterpiece' : 'cinematic masterpieces'}
              </Text>
            </View>
            <View style={styles.scrollContainer}>
              {map(movies, (movie) => (
                <View style={styles.movieContainer} key={movie._id}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => setSelectedMovie(movie)}
                  >
                    <Image source={{ uri: getMovieWithChangedResolution(movie).img }} style={styles.image} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 25,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 230,
    shadowColor: '#00000070',
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
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    textAlign: 'center',
    width: '90%',
  },
  noMoviesContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  header: {
    marginTop: 10,
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
  subHeader: {
    color: 'white',
    fontFamily: 'Montserrat-Medium',
    fontSize: 20,
    textAlign: 'center',
  },
  number: {
    marginTop: 20,
    color: colors.orange,
    fontFamily: 'Montserrat-Bold',
    fontSize: 40,
    textAlign: 'center',
  },
});
