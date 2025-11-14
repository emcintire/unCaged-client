import { useCallback, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';
import { type Movie, useCurrentUser, useRatings } from '@/services';
import { changeResolution, movieCard, screen, typography } from '@/config';
import AdBanner from '@/components/AdBanner';
import MovieModal from '@/components/movieModal/MovieModal';
import Screen from '@/components/Screen';

export default function RatingsScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isRatingsLoading } = useRatings();
  
  const isLoading = isUserLoading || isRatingsLoading;
  const isAdmin = user?.isAdmin ?? false;
  
  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? screen.centered : screen.noPadding}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={typography.h1}>You will see your rated movies here</Text>
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
                    style={movieCard.button}
                    onPress={() => setSelectedMovie(movie)}
                  >
                    <Image source={{ uri: getMovieWithChangedResolution(movie).img }} style={movieCard.image} />
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
