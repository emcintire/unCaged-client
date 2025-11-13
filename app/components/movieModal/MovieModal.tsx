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

type Props = {
  isOpen: boolean;
  movie: Movie;
  onClose: () => void;
};

export default function MovieModal({ isOpen, movie: propsMovie, onClose }: Props) {
  const [movie, setMovie] = useState<Movie>(propsMovie);

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: ratingData, isLoading: isRatingLoading } = useAverageRating(propsMovie?._id || '');
  
  const isLoading = isUserLoading || isRatingLoading;
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
    background: {
      backgroundColor: '#00000090',
      height: '100%',
      width: '100%',
    },
    container: {
      width: '90%',
      height: '100%',
      alignSelf: 'center',
      backgroundColor: colors.bg,
      borderColor: colors.orange,
      borderWidth: 1,
      borderRadius: 10,
      marginTop: 60,
      marginBottom: 60,
      padding: 15,
    },
    btnContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      zIndex: 10,
    },
    image: {
      marginTop: 20,
      height: 320,
      width: 215,
      resizeMode: 'cover',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'transparent',
      overflow: 'hidden',
      alignSelf: 'center',
    },
    titleContainer: {
      width: '90%',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 10,
    },
    title: {
      color: colors.white,
      fontFamily: 'Montserrat-Bold',
      fontSize: 26,
      textAlign: 'center',
    },
    subtitle: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      marginTop: 10,
      width: '100%',
    },
    date: {
      color: colors.white,
      fontFamily: 'Montserrat-Medium',
      fontSize: 18,
      textAlign: 'left',
    },
    director: {
      color: colors.white,
      fontFamily: 'Montserrat-Medium',
      fontSize: 18,
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

  if (!isOpen || movie == null) { return null; }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      {(isLoading || isUserLoading) ? <Loading /> : (
        <View style={styles.background}>
          {!user?.isAdmin && (
            <View style={styles.adContainerTop}>
              <AdBanner />
            </View>
          )}
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
        </View>
      )}
    </Modal>
  );
}
