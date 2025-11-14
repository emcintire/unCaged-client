import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AdBanner from '../AdBanner';
import Icon from '../Icon';
import colors from '../../config/colors';
import { changeResolution } from '../../config/helperFunctions';
import Loading from '../Loading';
import { reject } from 'lodash';
import MovieModalDetails from './MovieModalDetails';
import MovieModalActions from './MovieModalActions';
import {type  Movie, useCurrentUser } from '../../api';
import { useAverageRating } from '../../api/controllers/movies.controller';
import { modal, spacing, fontSize, fontFamily, movieCard } from '../../config/theme';

type Props = {
  isOpen: boolean;
  movie: Movie | null;
  onClose: () => void;
};

export default function MovieModal({ isOpen, movie: propsMovie, onClose }: Props) {
  const [movie, setMovie] = useState<Movie | null>(propsMovie);

  const { data: user } = useCurrentUser();
  const { data: ratingData, isLoading } = useAverageRating(propsMovie?._id || '');
  
  const movieRating = ratingData ? Number(ratingData) : 0;

  useEffect(() => {
    if (!isOpen || propsMovie == null) { return; }

    const parsedMovie = {
      ...(propsMovie.img.length === 32 ? changeResolution('h', propsMovie) : propsMovie),
      genres: reject(propsMovie.genres, 'Popular'),
    };

    setMovie(parsedMovie);
  }, [propsMovie, isOpen]);

  const styles = StyleSheet.create({
    background: modal.background,
    container: {
      ...modal.container,
      borderColor: colors.orange,
      borderWidth: 1,
      padding: spacing.md,
    },
    btnContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 10,
    },
    image: {
      ...movieCard.image,
      alignSelf: 'center',
      height: 320,
      marginTop: spacing.lg,
      width: 215,
    },
    titleContainer: {
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: spacing.sm,
    },
    title: {
      color: colors.white,
      fontFamily: fontFamily.bold,
      fontSize: fontSize.xxl + 4,
      textAlign: 'center',
    },
    subtitle: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: spacing.sm,
      width: '100%',
    },
    date: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: fontSize.lg,
      textAlign: 'left',
    },
    director: {
      color: colors.white,
      fontFamily: fontFamily.medium,
      fontSize: fontSize.lg,
    },
    adContainerTop: {
      position: 'absolute',
      width: '100%',
      height: 'auto',
      left: 0,
      top: 0,
    },
    adContainerBottom: {
      position: 'absolute',
      width: '100%',
      height: 'auto',
      left: 0,
      bottom: 0,
    },
  });

  if (!isOpen) { return null; }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.background}>
        {!user?.isAdmin && (
          <View style={styles.adContainerTop}>
            <AdBanner />
          </View>
        )}
        {(isLoading || movie == null) ? <Loading /> : (
          <ScrollView
            horizontal={false}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={200}
            decelerationRate="fast"
            style={styles.container}
          >
            <View style={styles.btnContainer}>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={30} backgroundColor={colors.black} iconColor={colors.red} />
              </TouchableOpacity>
            </View>
            <Image source={{ uri: movie.img }} style={styles.image} />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.subtitle}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.date}>{movieRating}</Text>
                  <Text style={styles.date}> / 5</Text>
                </View>
                <Text style={styles.date}>{movie.date?.substring(0, 4)}</Text>
              </View>
            </View>
            <MovieModalActions movie={movie} />
            <MovieModalDetails movie={movie} />
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}
