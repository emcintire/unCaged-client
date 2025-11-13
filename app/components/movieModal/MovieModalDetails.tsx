import { StyleSheet, Text, View } from 'react-native';
import colors from '../../config/colors';
import type { Movie } from '../../api';
import { join } from 'lodash';
import { spacing, fontSize, fontFamily } from '../../config/theme';

type Props = {
  movie: Movie;
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxl * 2,
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    marginBottom: spacing.sm,
    width: '50%',
  },
  details: {
    color: colors.white,
    fontFamily: fontFamily.light,
    fontSize: fontSize.md,
    width: '50%',
  },
  description: {
    color: colors.white,
    fontFamily: fontFamily.light,
    fontSize: fontSize.md,
    width: '95%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '95%',
  },
});

export default function MovieModalDetails({ movie }: Props) {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Genres:</Text>
        <Text style={styles.details}>{join(movie.genres, ', ')}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Age rating:</Text>
        <Text style={styles.details}>{movie.rating}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Runtime:</Text>
        <Text style={styles.details}>{movie.runtime}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Director:</Text>
        <Text style={styles.details}>{movie.director}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.details}></Text>
      </View>
      <Text style={styles.description}>{movie.description}</Text>
    </View>
  );
}
