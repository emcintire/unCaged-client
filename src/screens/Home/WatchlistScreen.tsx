import { useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';
import { type Movie, useCurrentUser, useWatchlist } from '@/services';
import { changeResolution, movieCard, screen, typography } from '@/config';
import Screen from '@/components/Screen';
import MovieModal from '@/components/movieModal/MovieModal';
import AdBanner from '@/components/AdBanner';

export default function WatchlistScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isMoviesLoading } = useWatchlist();
  
  const isLoading = isUserLoading || isMoviesLoading;
  const isAdmin = user?.isAdmin ?? false;

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? screen.centered : screen.noPadding}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={typography.h1}>Add movies to your watchlist and you will see them here</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
          <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
            <View style={movieCard.scrollContainer}>
              {map(movies, (movie) => (
                <View style={movieCard.container} key={movie._id}>
                  <TouchableOpacity
                    onPress={() => setSelectedMovie(movie)}
                    style={movieCard.button}
                  >
                    <Image
                      source={{ uri: changeResolution('l', movie).img }}
                      style={movieCard.image}
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
