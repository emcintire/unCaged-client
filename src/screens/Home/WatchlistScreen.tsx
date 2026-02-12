import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { type Movie, useCurrentUser, useWatchlist } from '@/services';
import { changeResolution, movieCard, screen, typography } from '@/config';
import Screen from '@/components/Screen';
import MovieModal from '@/components/movieModal/MovieModal';
import MovieGridSkeleton from '@/components/MovieGridSkeleton';
import AdBanner from '@/components/AdBanner';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const NUM_COLUMNS = 2;

export default function WatchlistScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: movies = [], isLoading: isMoviesLoading } = useWatchlist();

  const isLoading = isUserLoading || isMoviesLoading;
  const isAdmin = user?.isAdmin ?? false;

  const getMovieWithChangedResolution = useCallback((movie: Movie) => changeResolution('l', movie), []);

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <View style={[movieCard.container, styles.columnItem]}>
      <TouchableOpacity onPress={() => setSelectedMovie(item)} style={movieCard.button}>
        <Image source={getMovieWithChangedResolution(item).img} style={movieCard.image} />
      </TouchableOpacity>
    </View>
  ), [getMovieWithChangedResolution]);

  const keyExtractor = useCallback((item: Movie) => item._id, []);

  return (
    <Screen isLoading={isLoading} skeleton={<MovieGridSkeleton />} style={!isLoading && movies.length === 0 ? screen.centered : screen.noPadding}>
      {!isAdmin && <AdBanner />}
      {movies.length === 0 ? (
        <>
          <Text style={typography.h1}>Add movies to your watchlist and you will see them here!</Text>
          <BuyMeCoffeeButton />
        </>
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
