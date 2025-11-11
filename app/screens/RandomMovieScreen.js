import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Modal,
  TouchableOpacity,
  Dimensions,
  Text,
  Platform,
  Pressable,
  Switch,
} from 'react-native';
import _ from 'underscore';
import { changeResolution, genres, showErrorToast } from '../config/helperFunctions';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import AdBanner from '../components/AdBanner';

import Screen from '../components/Screen';
import colors from '../config/colors';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import Separator from '../components/Separator';

class RandomMovieScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      filtersModalVisible: false,
      genreFilter: '',
      isAdmin: '',
      isLoaded: false,
      mandyFilter: false,
      modalVisible: false,
      movie: '',
      token: '',
      watchlistFilter: false,
      unseenFilter: false,
    };
  };

  componentDidMount() {
    this.fetchUserData();
  }

  fetchUserData = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/users',
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
      return;
    }

    this.setState({ token, isAdmin: body.isAdmin }, this.getRandomMovie);
  };

  getRandomMovie = async () => {
    const { movie: currentMovie, genreFilter, mandyFilter, token, unseenFilter, watchlistFilter } = this.state;
    this.setState({ isLoaded: false });

    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/users/filteredMovies',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          unseen: unseenFilter,
          mandy: mandyFilter,
          watchlist: watchlistFilter,
          genre: genreFilter,
        }),
      }
    );

    let movies = await response.json();
    if (response.status !== 200) {
      showErrorToast(body);
      return;
    }

    if (movies.length === 0) {
      this.setState({ movie: null, isLoaded: true });
      return;
    }

    let randInt = Math.floor(Math.random() * movies.length);
    let movie = movies[randInt];

    // Dont show same movie twice in a row
    if (movie._id === currentMovie?._id && !mandyFilter) {
      movies = movies.filter((m) => m._id !== currentMovie.id)
      randInt = Math.floor(Math.random() * movies.length);
      movie = movies[randInt];
    }
    movie = changeResolution('', movie);

    this.setState({ movie, isLoaded: true });
  };

  render() {
    const {
      filtersModalVisible,
      genreFilter,
      isAdmin,
      isLoaded,
      mandyFilter,
      modalVisible,
      movie,
      token,
      unseenFilter,
      watchlistFilter,
    } = this.state;

    if (!isLoaded) { return <Loading />; }

    return (
      <Screen style={styles.container}>
        {!isAdmin && (
          <View style={styles.adContainer}>
            <AdBanner />
          </View>
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <MovieModal
            movie={movie}
            setModalVisible={() => this.setState({ modalVisible: false })}
            modalVisible={modalVisible}
            token={token}
          />
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={filtersModalVisible}
          onRequestClose={() => this.setState({ filtersModalVisible: false })}
        >
          <View style={styles.filtersModalContainer}>
            <Pressable
              style={styles.transparentBg}
              onPress={() => this.setState({ filtersModalVisible: false })}
            />
            <View style={styles.filtersModal}>
              <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Filters</Text>
              </View>
              <View style={{ width: '75%' }}>
                <Text style={styles.label}>Unseen</Text>
              </View>
              <View style={{ width: '25%' }}>
                <Switch
                  onValueChange={(value) => this.setState({ unseenFilter: value })}
                  value={unseenFilter}
                  trackColor={{ true: colors.orange }}
                  thumbColor={colors.light}
                />
              </View>
              <Separator modal />
              <View style={{ width: '75%' }}>
                <Text style={styles.label}>On Watchlist</Text>
              </View>
              <View style={{ width: '25%' }}>
                <Switch
                  onValueChange={(value) => this.setState({ watchlistFilter: value })}
                  value={watchlistFilter}
                  trackColor={{ true: colors.orange }}
                  thumbColor={colors.light}
                />
              </View>
              <Separator modal />
              <View style={{ width: '75%' }}>
                <Text style={styles.label}>Masterpieces</Text>
              </View>
              <View style={{ width: '25%' }}>
                <Switch
                  onValueChange={(value) => this.setState({ mandyFilter: value })}
                  value={mandyFilter}
                  trackColor={{ true: colors.orange }}
                  thumbColor={colors.light}
                />
              </View>
              <Separator modal />
              <View style={{ width: '60%' }}>
                <Text style={styles.label}>Genre</Text>
              </View>
              <View style={{ width: '40%' }}>
                <Picker
                  selectedValue={genreFilter}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(value) => this.setState({ genreFilter: value })}
                >
                  {genres.map((genre) => (
                    <Picker.Item key={genre} style={styles.label} label={genre} value={genre} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>
        </Modal>
        {movie == null ? (
          <View style={{ height: '80%', justifyContent: 'center' }}>
            <Text style={styles.noResults}>No results :(</Text>
          </View>
        ) : (
          <View style={styles.movieContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.setState({ modalVisible: true })}
            >
              <Image
                source={{ uri: movie.img }}
                style={styles.image}
              />
            </TouchableOpacity>
          </View>
        )}
        <View>
          <TouchableOpacity
            style={styles.refreshBtn}
            onPress={this.getRandomMovie}
          >
            <View style={styles.inner}>
              <Text style={styles.text}>CAGE ME</Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.filtersBtn}
          onPress={() => this.setState({ filtersModalVisible: true })}
        >
          <MaterialCommunityIcons
            name="tune"
            color="grey"
            size={35}
          />
        </TouchableOpacity>
      </Screen>
    );
  }
}

const screen = Dimensions.get('window').width + Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  button: {
    width: screen < 1100 ? 285 : 320,
    height: screen < 1100 ? 435 : 485,
    shadowColor: '#00000080',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1.0,
    backgroundColor: '#000000',
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
  refreshBtn: {
    height: 60,
    width: 150,
    backgroundColor: '#976000',
    borderRadius: 12,
    padding: 0,
    marginVertical: 10,
  },
  noResults: {
    color: 'white',
    fontFamily: 'Montserrat-Bold',
    fontSize: 30,
  },
  inner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    width: 150,
    borderRadius: 12,
    backgroundColor: colors.orange,
  },
  headerContainer: {
    position: 'absolute',
    top: 10,
  },
  headerText: {
    fontFamily: 'Montserrat-Black',
    fontSize: 26,
  },
  text: {
    fontSize: 22,
    fontFamily: 'Montserrat-Black',
    color: 'white',
  },
  filtersModalContainer: {
    height: '100%',
    backgroundColor: 'transparent',
  },
  transparentBg: {
    height: '100%',
    backgroundColor: '#0000007b',
  },
  filtersModal: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderColor: colors.orange,
    borderWidth: 4,
    borderBottomWidth: 0,
    backgroundColor: colors.white,
    height: 'auto',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filtersBtn: {
    position: 'absolute',
    right: 40,
    bottom: 55,
  },
  label: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold'
  },
  adContainer: {
    position: 'absolute',
    width: '100%',
    height: 'auto',
    left: 0,
    top: -25,
  },
});

export default RandomMovieScreen;
