import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { reject } from 'lodash';
import { type Movie, useCurrentUser, useAverageRating } from '@/services';
import { changeResolution, colors, fontFamily, fontSize, modal, movieCard, spacing } from '@/config';
import AdBanner from '../AdBanner';
import Icon from '../Icon';
import Loading from '../Loading';
import MovieModalDetails from './MovieModalDetails';
import MovieModalActions from './MovieModalActions';

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
    container: modal.container,
    btnContainer: {
      position: 'absolute',
      right: -15,
      top: -15,
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
                <Icon name="close" size={50} backgroundColor="transparent" iconColor={colors.white} />
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
