import { mergeApis, Zodios } from '@zodios/core';
import * as SecureStore from 'expo-secure-store';
import { userApi } from './controllers/users.controller';
import { movieApi } from './controllers/movies.controller';
import { env } from '../config/env';
import { STORAGE_KEYS } from '../constants';

const apiContract = mergeApis({
  'users': userApi,
  'movies': movieApi,
});

const baseClient = new Zodios(env.apiBaseUrl, apiContract);

baseClient.axios.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(STORAGE_KEYS.AUTH_TOKEN);
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

baseClient.axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging in development
    if (env.isDev) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });
    }
    
    // Handle common error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      SecureStore.deleteItemAsync(STORAGE_KEYS.AUTH_TOKEN);
    }
    
    return Promise.reject(error);
  }
);

export const zodiosClient = baseClient;

export type ApiClient = typeof zodiosClient;
