import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../config/colors';
import { changeResolution, showErrorToast } from '../config/helperFunctions';

import Screen from '../components/Screen';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import AppButton from '../components/AppButton';

const styles = StyleSheet.create({
  container: {
    fontFamily: 'Montserrat-ExtraBold',
    backgroundColor: colors.bg,
    paddingTop: 0,
    paddingBottom: 0,
  },
  quote: {
    fontFamily: 'Montserrat-ExtraLight',
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
    marginTop: 30,
    paddingHorizontal: 10,
  },
  subquote: {
    marginTop: 8,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  subsubquote: {
    marginTop: 5,
    marginBottom: 10,
    fontFamily: 'Montserrat-ExtraLight',
    fontSize: 10,
    color: 'white',
    textAlign: 'center',
  },
  header: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 25,
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 15,
  },
  button: {
    marginRight: 10,
    width: 135,
    height: 200,
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
  tagline: {
    marginTop: 10,
    fontFamily: 'Montserrat-Medium',
    fontSize: 16,
    color: colors.white,
    alignSelf: 'center',
  },
  subTagline: {
    fontFamily: 'Montserrat-Light',
    fontSize: 13,
    color: colors.white,
    alignSelf: 'flex-start',
  },
  quoteInput: {
    width: '90%',
    borderRadius: 25,
    fontSize: 18,
    backgroundColor: colors.black,
    color: colors.white,
    alignSelf: 'center',
    padding: 10,
    margin: 10
  },
  quoteSubmit: {
    width: '50%',
    alignSelf: 'center',
  }
});

const genres = [
  'Popular',
  'Thriller',
  'Drama',
  'Action',
  'Comedy',
  'Family',
  'Romance',
  'Horror',
  'Crime',
  'War',
  'Mystery',
  'Documentary',
  'Sci-Fi',
  'Fantasy',
];

class HomeScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      isLoaded: false,
      modalVisible: false,
      movies: [],
      newQuote: '',
      newSubQuote: '',
      quote: '',
      selectedMovie: '',
      token: '',
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  getMovies = async (token) => {
    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/movies/getMovies',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const body = await response.json();

    if (response.status !== 200) {
      showErrorToast(body);
      return;
    }

    this.setState({ movies: body, token })
  };

  getQuote = async (token) => {
    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/movies/quote',
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
      }
    );

    const body = await response.json();

    if (response.status !== 200) {
      showErrorToast(body);
      return;
    }

    this.setState({ quote: body[0] ?? body });
  };

  getUser = async (token) => {
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

    this.setState({ isAdmin: body?._id === '61857ba3f07dd937dcaf6a1e' });
  };

  fetchData = async () => {
    const token = await AsyncStorage.getItem('token');
    await Promise.all([
      this.getMovies(token),
      this.getQuote(token),
      this.getUser(token),
    ]);
    this.setState({ isLoaded: true });
  };

  submitQuote = async () => {
    const { newQuote, newSubQuote, token } = this.state;
    const response = await fetch(
      'https://uncaged-server.herokuapp.com/api/movies/quote',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'x-auth-token': token
        },
        body: JSON.stringify({
          quote: newQuote.trim(),
          subquote: newSubQuote.trim(),
        }),
      }
    );
    const body = await response.text();
  
    if (response.status !== 200) {
      showErrorToast(body);
    } else {
      this.setState({ quote: JSON.parse(bodt) });
    }  
  };

  hideModal = () => this.setState({ modalVisible: false });

  render() {
    const { isAdmin, isLoaded, modalVisible, movies, quote, selectedMovie, token } = this.state;

    if (!isLoaded) { return <Loading />; }

    return (
      <Screen style={styles.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={this.hideModal}
        >
          <MovieModal
            movie={selectedMovie}
            setModalVisible={this.hideModal}
            modalVisible={modalVisible}
            token={token}
          />
        </Modal>
        <ScrollView
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
        >
          {isAdmin && (
            <View>
              <TextInput
                style={styles.quoteInput}
                placeholder="Enter title"
                placeholderTextColor={colors.medium}
                onChangeText={(text) => this.setState({ newQuote: text })}
              />
              <TextInput
                style={styles.quoteInput}
                placeholder="Enter sub title"
                placeholderTextColor={colors.medium}
                onChangeText={(text) => this.setState({ newSubQuote: text })}
              />
              <AppButton
                onPress={this.submitQuote}
                style={styles.quoteSubmit}
                title="Submit"
              />
            </View>
          )}
          <Text style={styles.quote}>{quote.quote}</Text>
          <Text style={styles.subquote}>{quote.subquote}</Text>
          <Text style={styles.subsubquote}>Verse of the Week</Text>
          {genres.map((genre, index) => {
            return (
              <View key={index + 6969}>
                <Text style={styles.header}>{genre}</Text>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={200}
                  decelerationRate="fast"
                  contentContainerStyle={{ marginLeft: 15 }}
                >
                  {movies.map((movie, index) => {
                    movie = changeResolution('l', movie);
                    if (movie.genres.includes(genre)) {
                      return (
                        <TouchableOpacity
                          style={styles.button}
                          key={index}
                          onPress={() => this.setState({ selectedMovie: movie, modalVisible: true })}
                        >
                          <Image
                            source={{ uri: movie.img }}
                            style={styles.image}
                          />
                        </TouchableOpacity>
                      );
                    }
                  })}
                  <View style={{ width: 20 }} />
                </ScrollView>
              </View>
            );
          })}
        </ScrollView>
      </Screen>
    );
  }
}

export default HomeScreen;
exports.changeResolution = changeResolution;
