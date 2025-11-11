import { StyleSheet, Text, View } from 'react-native';
import type { Movie } from '../../types';
import colors from '../../config/colors';

type Props = {
  movie: Movie;
};

const styles = StyleSheet.create({
  detailsContainer: {
    marginTop: 20,
    marginBottom: 60,
    alignItems: 'center',
  },
  label: {
    color: colors.white,
    fontFamily: 'Montserrat-Medium',
    fontSize: 15,
    marginBottom: 10,
    width: '50%',
  },
  details: {
    color: colors.white,
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    width: '50%',
  },
  description: {
    color: colors.white,
    fontFamily: 'Montserrat-Light',
    fontSize: 15,
    width: '95%',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '95%',
  },
});

export default function MovieDetails({
  movie,
}: Props) {
  return (
    <View style={styles.detailsContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Genres:</Text>
        <Text style={styles.details}>{movie.genres.join(', ')}</Text>
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
