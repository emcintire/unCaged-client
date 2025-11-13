import { useState } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';
import type{ Movie } from '../../api';
import { changeResolution } from '../../config/helperFunctions';
import Screen from '../../components/Screen';
import colors from '../../config/colors';
import MovieModal from '../../components/movieModal/MovieModal';
import AdBanner from '../../components/AdBanner';
import { useCurrentUser, useWatchlist } from '../../api/controllers/users.controller';

export default function WatchlistScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isMoviesLoading } = useWatchlist();
  
  const isLoading = isUserLoading || isMoviesLoading;
  const isAdmin = user?.isAdmin ?? false;

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? styles.noMoviesContainer : styles.container}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={styles.text}>Add movies to your watchlist and you will see them here</Text>
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
                    onPress={() => setSelectedMovie(movie)}
                    style={styles.button}
                  >
                    <Image
                      source={{ uri: changeResolution('l', movie).img }}
                      style={styles.image}
                    />
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
    width: '100%',
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
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: 0,
  },
});
