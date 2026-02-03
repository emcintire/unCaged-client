import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { type Movie, useCurrentUser, useFavorites } from '@/services';
import { changeResolution, movieCard, screen, typography } from '@/config';
import AdBanner from '@/components/AdBanner';
import MovieModal from '@/components/movieModal/MovieModal';
import MovieGridSkeleton from '@/components/MovieGridSkeleton';
import Screen from '@/components/Screen';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const NUM_COLUMNS = 2;

export default function FavoritesScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isMoviesLoading } = useFavorites();

  const isLoading = isUserLoading || isMoviesLoading;
  const isAdmin = user?.isAdmin ?? false;

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <View style={[movieCard.container, styles.columnItem]}>
      <TouchableOpacity style={movieCard.button} onPress={() => setSelectedMovie(item)}>
        <Image source={getMovieWithChangedResolution(item).img} style={movieCard.image} />
      </TouchableOpacity>
    </View>
  ), [getMovieWithChangedResolution]);

  const keyExtractor = useCallback((item: Movie) => item._id, []);

  return (
    <Screen isLoading={isLoading} skeleton={<MovieGridSkeleton />} style={movies.length === 0 ? screen.centered : screen.noPadding}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <Text style={typography.h1}>You will see your favorite movies here</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
          <FlatList
            data={movies}
            renderItem={renderMovie}
            keyExtractor={keyExtractor}
            numColumns={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListFooterComponent={<BuyMeCoffeeButton />}
          />
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    alignItems: 'center',
    paddingTop: 15,
  },
  columnItem: {
    width: '50%',
  },
});
