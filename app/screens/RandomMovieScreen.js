import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Modal,
    TouchableOpacity,
    Dimensions,
    AsyncStorage,
    Text,
    Pressable,
    Switch,
} from 'react-native';
import _ from 'underscore';
import { changeResolution } from '../config/helperFunctions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Screen from '../components/Screen';
import colors from '../config/colors';
import MovieModal from '../components/MovieModal';
import Loading from '../components/Loading';
import Separator from '../components/Separator';

const fetchUserData = async (setToken) => {
    AsyncStorage.getItem('token')
        .then(async (token) => {
            let response = await fetch(
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
                alert(body);
            } else {
                setToken(token);
            }
        })
        .catch((err) => {
            console.log(err);
        });
};

const getRandomMovie = async (setMovie, setLoading, selected, token, mandy) => {
    setLoading(true);

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

    const body = await response.json();
    if (response.status !== 200) return alert(body);
    
    let movies = body;
    let randInt = Math.floor(Math.random() * movies.length);

    if (mandy) {
        let movie = movies.find((m) => m.title === 'Mandy');
        movie = changeResolution('', movie);
    
        setMovie(movie);
        setLoading(false);
        return;
    }

    if (selected) {
        response = await fetch(
            'https://uncaged-server.herokuapp.com/api/users/unseen',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'x-auth-token': token,
                },
            }
        );
        movies = await response.json();
        if (response.status !== 200) return alert(movies);
        randInt = Math.floor(Math.random() * movies.length);
    }

    let movie = movies[randInt];
    movie = changeResolution('', movie);;

    setMovie(movie);
    setLoading(false);
};

function RandomMovieScreen(props) {
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [filtersModalVisible, setFiltersModalVisible] = useState(false);
    const [selected, setSelected] = useState(false);
    const [mandy, setMandy] = useState(false);
    const [token, setToken] = useState('');
    const [movie, setMovie] = useState([]);

    useEffect(() => {
        fetchUserData(setToken);
        getRandomMovie(setMovie, setLoading, selected, token, mandy);
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
                        movie={movie}
                        setModalVisible={setModalVisible}
                        modalVisible={modalVisible}
                        token={token}
                    />
                </Modal>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={filtersModalVisible}
                    onRequestClose={() => {
                        setFiltersModalVisible(!filtersModalVisible);
                    }}
                >
                    <View style={styles.filtersModalContainer}>
                        <Pressable
                            style={styles.transparentBg}
                            onPress={() =>
                                setFiltersModalVisible(!filtersModalVisible)
                            }
                        />
                        <View style={styles.filtersModal}>
                            <View style={{width: '75%'}}>
                                <Text style={styles.label}>Only unseen</Text>
                            </View>
                            <View style={{width: '25%'}}>
                                <Switch
                                    onValueChange={setSelected}
                                    value={selected}
                                    trackColor={{ true: colors.orange }}
                                />
                            </View>
                            <Separator modal />
                            <View style={{width: '75%'}}>
                                <Text style={styles.label}>Only masterpieces</Text>
                            </View>
                            <View style={{width: '25%'}}>
                                <Switch
                                    onValueChange={setMandy}
                                    value={mandy}
                                    trackColor={{ true: colors.orange }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={styles.movieContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setModalVisible(true);
                        }}
                    >
                        <Image
                            source={{ uri: movie.img }}
                            style={styles.image}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.refreshBtn}
                        onPress={() => getRandomMovie(setMovie, setLoading, selected, token, mandy)}
                    >
                        <View style={styles.inner}>
                            <Text style={styles.text}>CAGE ME</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.filtersBtn}
                    onPress={() => setFiltersModalVisible(!filtersModalVisible)}
                >
                    <MaterialCommunityIcons
                        name="tune"
                        color="grey"
                        size={35}
                    />
                </TouchableOpacity>
            </Screen>
        );
    } else return <Loading />;
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
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 55,
        width: 150,
        borderRadius: 12,
        backgroundColor: colors.orange,
    },
    text: {
        fontSize: 22,
        fontFamily: 'Montserrat-Black',
        color: 'white',
    },
    filtersModalContainer: {
        height: '100%',
    },
    transparentBg: {
        height: '75%',
        backgroundColor: '#0000007b',
    },
    filtersModal: {
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        borderColor: colors.orange,
        borderWidth: 4,
        borderBottomWidth: 0,
        backgroundColor: colors.white,
        height: '25%',
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
    }
});

export default RandomMovieScreen;
