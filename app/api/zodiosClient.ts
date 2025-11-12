import { mergeApis, Zodios } from '@zodios/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { userApi } from './controllers/users.controller';
import { movieApi } from './controllers/movies.controller';

const API_BASE_URL = Constants.expoConfig?.extra?.apiBaseUrl;

const apiContract = mergeApis({
  'users': userApi,
  'movies': movieApi,
});

const baseClient = new Zodios(API_BASE_URL, apiContract);

baseClient.axios.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

baseClient.axios.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const zodiosClient = baseClient;

export type ApiClient = typeof zodiosClient;
