import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    Modal,
    TouchableOpacity,
    AsyncStorage,
    TextInput,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import colors from '../config/colors';
import { changeResolution } from '../config/helperFunctions';

import Screen from '../components/Screen';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import AppButton from '../components/AppButton';

const fetchData = async (setMovies, setLoading, setToken, setQuoteObj, setIsAdmin) => {
    AsyncStorage.getItem('token')
        .then(async (token) => {
            let response = await fetch(
                'https://uncaged-server.herokuapp.com/api/movies/getMovies',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            let body = await response.json();

            if (response.status !== 200) {
                alert(body);
            } else {
                setMovies(body);
                setToken(token);
            }

            response = await fetch(
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

            body = await response.json();

            if (response.status !== 200) {
                alert(body);
            } else {
                const quote = body[0] || body;
                setQuoteObj(quote);
            }

            response = await fetch(
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

            body = await response.json();

            if (response.status !== 200) {
                alert(body);
            } else {
                setIsAdmin(body.isAdmin);
                setLoading(false);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const submitQuote = async (token, newQuote, newSubQuote, setQuoteObj) => {
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
        alert(body);
    } else {
        setQuoteObj(JSON.parse(body));
    }
}

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

function HomeScreen(props) {
    const [movies, setMovies] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [token, setToken] = useState('');
    const [quoteObj, setQuoteObj] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [newQuote, setNewQuote] = useState('');
    const [newSubQuote, setNewSubQuote] = useState('');

    useEffect(() => {
        fetchData(setMovies, setLoading, setToken, setQuoteObj, setIsAdmin);
    }, []);

    if (!loading) {
        return (
            <Screen style={styles.container}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
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
                    {isAdmin && (
                        <View>
                            <TextInput
                                style={styles.quoteInput}
                                placeholder="Enter title"
                                placeholderTextColor={colors.medium}
                                onChangeText={(text) => setNewQuote(text)}
                            />
                            <TextInput
                                style={styles.quoteInput}
                                placeholder="Enter title"
                                placeholderTextColor={colors.medium}
                                onChangeText={(text) => setNewSubQuote(text)}
                            />
                            <AppButton
                                onPress={() => submitQuote(token, newQuote, newSubQuote, setQuoteObj)}
                                style={styles.quoteSubmit}
                                title="Submit"
                            />
                        </View>
                    )}
                    <Text style={styles.quote}>{quoteObj.quote}</Text>
                    <Text style={styles.subquote}>{quoteObj.subquote}</Text>
                    <Text style={styles.subsubquote}>Verse of the Day</Text>
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
                                                    onPress={() => {
                                                        setSelectedMovie(movie);
                                                        setModalVisible(true);
                                                    }}
                                                >
                                                    <Image
                                                        source={{
                                                            uri: movie.img,
                                                        }}
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
                    <View
                        style={{
                            alignSelf: 'center',
                            marginVertical: 40,
                        }}
                    >
                        <Text style={styles.tagline}>
                            Buy me some tendies :)
                        </Text>
                        <Text style={styles.subTagline}>
                            paypal: everettgsm@gmail.com
                        </Text>
                        <Text style={styles.subTagline}>venmo: @evdawgg</Text>
                    </View>
                </ScrollView>
            </Screen>
        );
    } else {
        return <Loading />;
    }
}

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

export default HomeScreen;
exports.changeResolution = changeResolution;
