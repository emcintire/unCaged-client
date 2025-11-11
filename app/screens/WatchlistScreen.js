import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { changeResolution, showErrorToast } from '../config/helperFunctions';
import Screen from '../components/Screen';
import colors from '../config/colors';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import AdBanner from '../components/AdBanner';

const getUser = async (token, setIsAdmin) => {
  const response = await fetch(
    'https://uncaged-server.herokuapp.com/api/users/',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    }
  );

  const body = await response.json();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    setIsAdmin(body.isAdmin);
  }
};

const getMovies = async (token, setMovies) => {
  const response = await fetch(
    'https://uncaged-server.herokuapp.com/api/users/watchlist',
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
    }
  );

  const body = await response.json();

  if (response.status !== 200) {
    showErrorToast(body);
  } else {
    setMovies(body);
  }
};

const fetchData = async (setMovies, setLoading, setToken, setIsAdmin) => {
  const token = await AsyncStorage.getItem('token');
  await Promise.all([
    getUser(token, setIsAdmin),
    getMovies(token, setMovies),
  ]);
  setToken(token);
  setLoading(false);
};

function WatchlistScreen(props) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState({});
  const [token, setToken] = useState('');

  useEffect(() => {
    fetchData(setMovies, setLoading, setToken, setIsAdmin);
  }, []);

  if (loading) { return <Loading />; }

  return (
    <>
      {!isAdmin && (
        <View style={styles.adContainerTop}>
          <AdBanner />
        </View>
      )}
      {movies.length == 0 ? (
        <Screen style={styles.noMoviesContainer}>
          <Text style={styles.text}>
            Add movies to your watchlist and you will see them here
          </Text>
        </Screen>
      ) : (
        <Screen style={styles.container}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(!modalVisible)}
          >
            <MovieModal
              movie={selectedMovie}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              token={token}
            />
          </Modal>
          <ScrollView
            showsVerticalScrollIndicator={false}
            decelerationRate="fast"
          >
            <View style={styles.scrollContainer}>
              {movies.map((movie, index) => {
                movie = changeResolution('l', movie);
                return (
                  <View
                    style={styles.movieContainer}
                    key={index + 6969}
                  >
                    <TouchableOpacity
                      style={styles.button}
                      key={index}
                      onPress={() => {
                        setSelectedMovie(movie);
                        setModalVisible(true);
                      }}
                    >
                      <Image
                        key={movie.id}
                        source={{ uri: movie.img }}
                        style={styles.image}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Screen>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
  },
  scrollContainer: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginTop: 25,
    width: '100%',
    justifyContent: 'space-evenly',
  },
  movieContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 230,
    shadowColor: '#00000070',
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    elevation: 3,
    borderRadius: 8,
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  text: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
    textAlign: 'center',
    width: '90%',
  },
  noMoviesContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: 0,
  },
});

export default WatchlistScreen;
