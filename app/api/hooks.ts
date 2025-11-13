// Common hooks and utilities for TanStack Query

import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userKeys } from './controllers/users.controller';
import { movieKeys } from './controllers/movies.controller';
import { STORAGE_KEYS } from '../constants';

/**
 * Hook to manually refetch user data
 * Useful after actions that should refresh user info
 */
export const useRefetchUser = () => {
  const queryClient = useQueryClient();
  
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    queryClient.invalidateQueries({ queryKey: userKeys.all });
  }, [queryClient]);
};

/**
 * Hook to manually refetch movies
 * Useful after adding/editing movies
 */
export const useRefetchMovies = () => {
  const queryClient = useQueryClient();
  
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: movieKeys.lists() });
  }, [queryClient]);
};

/**
 * Hook to clear all caches (useful on logout)
 */
export const useClearCache = () => {
  const queryClient = useQueryClient();
  return useCallback(async () => {
    queryClient.clear();
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  }, [queryClient]);
};
