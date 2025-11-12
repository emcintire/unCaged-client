import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { map } from 'lodash';

import colors from '../config/colors';
import type { SetState } from '../types';

const genres = [
  'Genre',
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'War',
];

type Props = {
  genre: string;
  genresVisible: boolean;
  selected: string;
  setGenre: SetState<string>;
  setGenresVisible: SetState<boolean>;
  setSelected: SetState<string>;
  setSortDirection: SetState<'asc' | 'desc'>;
  sortDirection: 'asc' | 'desc';
}

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
  const styles = StyleSheet.create({
    underSearchContainer: {
      width: '92%',
      zIndex: 999,
    },
    sortContainer: {
      backgroundColor: colors.dark,
      borderRadius: 25,
      borderTopLeftRadius: 0,
      borderTopRightRadius: 0,
      flexDirection: 'row',
      height: 45,
      width: '100%',
      alignItems: 'center',
    },
    label: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 15,
      color: colors.white,
    },
    gLabel: {
      fontFamily: 'Montserrat-Bold',
      fontSize: 12,
      color: genre === 'Genre' ? colors.white : colors.orange,
    },
    ratingBtn: {
      width: '25%',
      height: '100%',
      borderBottomLeftRadius: 25,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderLeftWidth: 1,
      borderBottomWidth: 1,
      backgroundColor: selected === 'rating' ? colors.orange : colors.black,
    },
    yearBtn: {
      width: '25%',
      height: '100%',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      backgroundColor: selected === 'year' ? colors.orange : colors.black,
    },
    azBtn: {
      width: '25%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      backgroundColor: selected === 'az' ? colors.orange : colors.black,
    },
    scrollContainer: {
      width: '25%',
      height: 150,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      position: 'absolute',
      right: 0,
      top: 45,
    },
    androidScrollContainer: {
      width: '25%',
      height: 150,
      marginBottom: 10,
      backgroundColor: colors.white,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      alignSelf: 'flex-end',
    },
    genresBtn: {
      width: '25%',
      height: '100%',
      borderBottomRightRadius: genresVisible ? 0 : 25,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: colors.white,
      borderBottomWidth: 1,
      borderRightWidth: 1,
      backgroundColor: selected === 'za' ? colors.orange : colors.black,
    },
    genreBtn: {
      width: '100%',
      height: 40,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    genreLabel: {
      fontFamily: 'Montserrat-Medium',
      fontSize: 12,
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
    <View style={styles.underSearchContainer}>
      <View style={styles.sortContainer}>
        <TouchableOpacity
          onPress={handleRatingPress}
          style={styles.ratingBtn}
        >
          <Text style={styles.label}>Rating</Text>
          <MaterialCommunityIcons
            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleYearPress}
          style={styles.yearBtn}
        >
          <Text style={styles.label}>Year</Text>
          <MaterialCommunityIcons
            name={sortDirection === 'asc' ? 'arrow-up' : 'arrow-down'}
            size={20}
            color={colors.white}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleAzPress}
          style={styles.azBtn}
        >
          {sortDirection === 'asc' ? (
            <Text style={styles.label}>A - Z</Text>
          ) : (
            <Text style={styles.label}>Z - A</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleGenresToggle}
          style={styles.genresBtn}
        >
          <Text style={styles.gLabel}>{genre}</Text>
        </TouchableOpacity>
      </View>
      {genresVisible ? (
        <View style={Platform.OS === 'ios' ? styles.scrollContainer : styles.androidScrollContainer}>
          <ScrollView decelerationRate="fast">
            {map(genres, (genreItem, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={styles.genreBtn}
                  onPress={() => handleGenreSelect(genreItem)}
                >
                  <Text style={styles.genreLabel}>{genreItem}</Text>
                </TouchableOpacity>
                <View style={genre === 'Fantasy' ? {} : styles.separator} />
              </View>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}
