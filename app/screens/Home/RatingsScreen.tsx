import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';
import AdBanner from '../../components/AdBanner';

import { changeResolution } from '../../config/helperFunctions';
import Screen from '../../components/Screen';
import colors from '../../config/colors';
import MovieModal from '../../components/movieModal/MovieModal';
import { Movie } from '../../types';
import { useCurrentUser, useRatings } from '../../api/controllers/users.controller';

export default function RatingsScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isRatingsLoading } = useRatings();
  
  const isLoading = isUserLoading || isRatingsLoading;
  const isAdmin = user?.isAdmin ?? false;
  
  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? styles.noMoviesContainer : styles.container}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={styles.text}>You will see your rated movies here</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie!}
            onClose={() => setSelectedMovie(null)}
          />
          <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
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
    zIndex: 100,
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
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: 0,
  },
});
