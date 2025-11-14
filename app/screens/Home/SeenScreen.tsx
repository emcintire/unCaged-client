import { useCallback, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';

import {type Movie } from '../../api';
import { useSeen } from '../../api/controllers/users.controller';
import colors from '../../config/colors';
import { changeResolution } from '../../config/helperFunctions';
import MovieModal from '../../components/movieModal/MovieModal';
import Screen from '../../components/Screen';
import { movieCard, screen, typography } from '../../config/theme';

export default function SeenScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data: movies = [], isLoading } = useSeen();

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  return (
    <Screen isLoading={isLoading} style={movies.length === 0 ? screen.centered : screen.noPadding}>
      {movies.length === 0 ? (
        <Text style={typography.h1}>What are you doing here... go watch a Nicolas Cage movie</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
          <ScrollView showsVerticalScrollIndicator={false} decelerationRate="fast">
            <View>
              <Text style={[typography.h2, { textAlign: 'center' }]}>
                You've seen
                <Text style={[typography.h2, { color: colors.orange }]}> {movies.length}</Text>{' '}
              </Text>
              <Text style={[typography.h3, { textAlign: 'center' }]}>
                {movies.length === 1 ? 'cinematic masterpiece' : 'cinematic masterpieces'}
              </Text>
            </View>
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
