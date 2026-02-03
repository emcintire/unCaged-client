import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, genres, borderRadius, fontSize, fontFamily, spacing } from '@/config';
import type { SetState } from '@/types';

type Props = {
  genre: string;
  genresVisible: boolean;
  selected: string;
  setGenre: SetState<string>;
  setGenresVisible: SetState<boolean>;
  setSelected: SetState<string>;
  setSortDirection: SetState<'asc' | 'desc'>;
  sortDirection: 'asc' | 'desc';
};

const allGenres = ['Genre', ...genres];

export default function SearchFilters({
  genre,
  genresVisible,
  selected,
  setGenre,
  setGenresVisible,
  setSelected,
  setSortDirection,
  sortDirection,
}: Props) {
  const toggleSortDirection = () => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

  const handleRatingPress = () => {
    if (selected === 'rating') {
      toggleSortDirection();
      return;
    }
    setSelected('rating');
  };

  const handleYearPress = () => {
    if (selected === 'year') {
      toggleSortDirection();
      return;
    }
    setSelected('year');
  };

  const handleAzPress = () => {
    if (selected === 'az') {
      toggleSortDirection();
      return;
    }
    setSelected('az');
  };

  const handleGenresToggle = () => setGenresVisible(!genresVisible);

  const handleGenreSelect = (genreItem: string) => {
    setGenre(genreItem);
    setGenresVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.underSearchContainer}>
        <View style={styles.sortContainer}>
          <TouchableOpacity onPress={handleRatingPress} style={[styles.sortBtn, styles.ratingBtn, selected === 'rating' && styles.activeBtn]} accessibilityRole="button" accessibilityLabel="Sort by rating">
            <Text style={styles.label}>Rating</Text>
            <MaterialCommunityIcons
              name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleYearPress} style={[styles.sortBtn, selected === 'year' && styles.activeBtn]} accessibilityRole="button" accessibilityLabel="Sort by year">
            <Text style={styles.label}>Year</Text>
            <MaterialCommunityIcons
              name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={20}
              color={colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleAzPress} style={[styles.sortBtn, styles.azBtn, selected === 'az' && styles.activeBtn]} accessibilityRole="button" accessibilityLabel="Sort alphabetically">
            <Text style={styles.label}>{sortDirection === 'asc' ? 'A - Z' : 'Z - A'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGenresToggle} style={[styles.sortBtn, styles.genresBtn, !genresVisible && styles.genresBtnClosed]} accessibilityRole="button" accessibilityLabel="Filter by genre">
            <Text style={[styles.gLabel, genre !== 'Genre' && styles.gLabelActive]}>{genre}</Text>
          </TouchableOpacity>
        </View>
        {genresVisible ? (
          <View style={Platform.OS === 'ios' ? styles.scrollContainer : styles.androidScrollContainer}>
            <ScrollView decelerationRate="fast">
              {allGenres.map((genreItem) => (
                <View key={genreItem}>
                  <TouchableOpacity style={styles.genreBtn} onPress={() => handleGenreSelect(genreItem)} accessibilityRole="button" accessibilityLabel={`Select ${genreItem} genre`}>
                    <Text style={styles.genreLabel}>{genreItem}</Text>
                  </TouchableOpacity>
                  {genreItem !== 'Fantasy' && <View style={styles.separator} />}
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  underSearchContainer: {
    width: '92%',
    zIndex: 999,
  },
  sortContainer: {
    backgroundColor: colors.dark,
    borderRadius: borderRadius.round,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    flexDirection: 'row',
    height: 45,
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.md,
    color: colors.white,
  },
  gLabel: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xs + 2,
    color: colors.white,
  },
  gLabelActive: {
    color: colors.orange,
  },
  sortBtn: {
    width: '25%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.white,
    borderBottomWidth: 1,
    backgroundColor: colors.black,
  },
  activeBtn: {
    backgroundColor: colors.orange,
  },
  ratingBtn: {
    borderBottomLeftRadius: borderRadius.round,
    borderLeftWidth: 1,
  },
  azBtn: {
    flexDirection: 'column',
  },
  genresBtn: {
    borderRightWidth: 1,
    flexDirection: 'column',
  },
  genresBtnClosed: {
    borderBottomRightRadius: borderRadius.round,
  },
  scrollContainer: {
    width: '25%',
    height: 150,
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    position: 'absolute',
    right: 0,
    top: 45,
  },
  androidScrollContainer: {
    width: '25%',
    height: 150,
    marginBottom: spacing.sm,
    backgroundColor: colors.white,
    borderBottomLeftRadius: borderRadius.md,
    borderBottomRightRadius: borderRadius.md,
    alignSelf: 'flex-end',
  },
  genreBtn: {
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  genreLabel: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.xs,
    color: 'black',
    alignSelf: 'center',
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: colors.light,
    alignSelf: 'center',
  },
});
