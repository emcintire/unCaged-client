import { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { type Movie, useSeen } from '@/services';
import { changeResolution, colors, movieCard, screen, typography } from '@/config';
import MovieModal from '@/components/movieModal/MovieModal';
import MovieGridSkeleton from '@/components/MovieGridSkeleton';
import Screen from '@/components/Screen';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const NUM_COLUMNS = 2;

export default function SeenScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: movies = [], isLoading } = useSeen();

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
      {movies.length === 0 ? (
        <Text style={typography.h1}>What are you doing here... go watch a Nicolas Cage movie</Text>
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
            ListHeaderComponent={
              <View style={styles.header}>
                <Text style={[typography.h2, styles.centerText]}>
                  You've seen
                  <Text style={[typography.h2, styles.countText]}> {movies.length}</Text>{' '}
                </Text>
                <Text style={[typography.h3, styles.centerText]}>
                  {movies.length === 1 ? 'cinematic masterpiece' : 'cinematic masterpieces'}
                </Text>
              </View>
            }
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
    paddingTop: 20,
  },
  columnItem: {
    width: '50%',
  },
  header: {
    width: '100%',
    marginBottom: 10,
  },
  centerText: {
    textAlign: 'center',
  },
  countText: {
    color: colors.orange,
  },
});
