import { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { type Movie, useCurrentUser, useFavorites, useMovies, useSeen } from '@/services';
import { movieCard, screen, typography, spacing } from '@/config';
import AdBanner from '@/components/AdBanner';
import CollectionStats from '@/components/CollectionStats';
import MovieCard from '@/components/MovieCard';
import MovieModal from '@/components/movieModal/MovieModal';
import MovieGridSkeleton from '@/components/MovieGridSkeleton';
import Screen from '@/components/Screen';
import BuyMeCoffeeButton from '@/components/BuyMeCoffeeButton';

const NUM_COLUMNS = 2;

export default function CollectionScreen() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: seenMovies = [], isLoading: isSeenLoading } = useSeen();
  const { data: favoriteMovies = [], isLoading: isFavoritesLoading } = useFavorites();
  const { data: allMovies = [], isLoading: isMoviesLoading } = useMovies();

  const isLoading = isUserLoading || isSeenLoading || isFavoritesLoading || isMoviesLoading;
  const isAdmin = user?.isAdmin ?? false;

  const favoriteIds = useMemo(
    () => new Set(favoriteMovies.map((m) => m._id)),
    [favoriteMovies],
  );

  const sortedMovies = useMemo(
    () => [...seenMovies].sort((a, b) => a.title.localeCompare(b.title)),
    [seenMovies],
  );

  const renderMovie = useCallback(({ item }: { item: Movie }) => (
    <View style={[movieCard.container, styles.columnItem]}>
      <MovieCard
        movie={item}
        onPress={() => setSelectedMovie(item)}
        isFavorite={favoriteIds.has(item._id)}
      />
    </View>
  ), [favoriteIds]);

  const keyExtractor = useCallback((item: Movie) => item._id, []);

  return (
    <Screen isLoading={isLoading} skeleton={<MovieGridSkeleton />} style={!isLoading && seenMovies.length === 0 ? screen.centered : screen.noPadding}>
      {!isAdmin && <AdBanner />}
      {seenMovies.length === 0 ? (
        <Text style={typography.h1}>What are you doing here... go watch a Nicolas Cage movie</Text>
      ) : (
        <>
          <MovieModal
            isOpen={selectedMovie != null}
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
          <FlatList
            data={sortedMovies}
            renderItem={renderMovie}
            keyExtractor={keyExtractor}
            numColumns={NUM_COLUMNS}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponentStyle={styles.headerContainer}
            ListHeaderComponent={
              <CollectionStats
                seenMovies={seenMovies}
                totalMovies={allMovies.length}
                userRatings={user?.ratings ?? []}
              />
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
    paddingTop: spacing.lg,
  },
  columnItem: {
    width: '50%',
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: spacing.md,
  },
});
