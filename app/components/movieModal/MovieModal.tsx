import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AdBanner from '../AdBanner';
import Icon from '../Icon';
import colors from '../../config/colors';
import { changeResolution, showErrorToast } from '../../config/helperFunctions';
import Loading from '../Loading';
import type { Movie, SetState, User } from '../../types';
import { reject } from 'lodash';
import MovieDetails from './MovieDetails';
import MovieActions from './MovieActions';

type Props = {
  isOpen: boolean;
  movie: Movie;
  onClose: () => void;
  token: string;
};

const fetchData = async (
  token: string,
  setUser: SetState<User | null>,
  setIsAdmin: SetState<boolean>
): Promise<void> => {
  const response = await fetch('https://uncaged-server.herokuapp.com/api/users/', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
  });

  const body = (await response.json()) as User | string;
  if (response.status !== 200) {
    showErrorToast(body as string);
    return;
  }

  const user = body as User;
  setIsAdmin(user.isAdmin);
  setUser(user);
};


export default function MovieModal({
  isOpen,
  movie: propsMovie,
  onClose,
  token,
}: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [movieRating, setMovieRating] = useState(0);
  const [movie, setMovie] = useState<Movie>(propsMovie);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetchData(token, setUser, setIsAdmin);
    getMovieRating();

    const parsedMovie = {
      ...(propsMovie.img.length === 32 ? changeResolution('h', propsMovie) : propsMovie),
      genres: reject(propsMovie.genres, 'Popular'),
    };

    setMovie(parsedMovie);
    setIsLoading(false);
  }, []);

  const getMovieRating = useCallback(async (): Promise<void> => {
    const response = await fetch(`https://uncaged-server.herokuapp.com/api/movies/avgRating/${propsMovie._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const body = await response.text();

    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      setMovieRating(Number(body));
    }
  }, [propsMovie._id]);

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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      {(isLoading || user == null) ? <Loading /> : (
        <View style={styles.background}>
          {!isAdmin && (
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
                <Text style={styles.date}>{movie.date.substring(0, 4)}</Text>
              </View>
            </View>
            <MovieActions
              movie={movie}
              onUpdateMovieRating={getMovieRating}
              token={token}
              user={user}
            />
            <MovieDetails movie={movie} />
          </ScrollView>
          {!isAdmin && (
            <View style={styles.adContainerBottom}>
              <AdBanner />
            </View>
          )}
        </View>
      )}
    </Modal>
  );
}
