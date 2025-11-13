import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { zodiosClient } from '../zodiosClient';
import { useClearCache } from '../hooks';
import { STORAGE_KEYS } from '../../constants';
import { logger } from '../../utils/logger';
import {
  ChangePasswordDataSchema,
  CheckCodeDataSchema,
  DeleteRatingDataSchema,
  DeleteUserDataSchema,
  ForgotPasswordDataSchema,
  IdSchema,
  LoginCredentialsSchema,
  MoviesArraySchema,
  RateMovieDataSchema,
  RegisterDataSchema,
  TokenResponseSchema,
  UpdateUserDataSchema,
  UserSchema,
} from '../schemas';
import { movieKeys } from './movies.controller';

export const userApi = makeApi([
  {
    method: 'get',
    path: '/',
    alias: 'getCurrentUser',
    response: UserSchema,
  }, {
    method: 'put',
    path: '/',
    alias: 'updateUser',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateUserDataSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'delete',
    path: '/',
    alias: 'deleteUser',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: DeleteUserDataSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'get',
    path: '/watchlist',
    alias: 'getWatchlist',
    response: MoviesArraySchema,
  }, {
    method: 'get',
    path: '/favorites',
    alias: 'getFavorites',
    response: MoviesArraySchema,
  }, {
    method: 'get',
    path: '/seen',
    alias: 'getSeen',
    response: MoviesArraySchema,
  }, {
    method: 'get',
    path: '/rate',
    alias: 'getRatings',
    response: MoviesArraySchema,
  }, {
    method: 'post',
    path: '/login',
    alias: 'login',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: LoginCredentialsSchema,
      },
    ],
    response: TokenResponseSchema,
  }, {
    method: 'post',
    path: '/register',
    alias: 'register',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: RegisterDataSchema,
      },
    ],
    response: TokenResponseSchema,
  }, {
    method: 'post',
    path: '/forgotpassword',
    alias: 'forgotPassword',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: ForgotPasswordDataSchema,
      },
    ],
    response: TokenResponseSchema,
  }, {
    method: 'post',
    path: '/checkcode',
    alias: 'checkCode',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CheckCodeDataSchema,
      },
    ],
    response: z.object({ message: z.string() }),
  }, {
    method: 'put',
    path: '/changepassword',
    alias: 'changePassword',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: ChangePasswordDataSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'put',
    path: '/watchlist',
    alias: 'addToWatchlist',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'delete',
    path: '/watchlist',
    alias: 'removeFromWatchlist',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'put',
    path: '/favorites',
    alias: 'addToFavorites',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'delete',
    path: '/favorites',
    alias: 'removeFromFavorites',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'put',
    path: '/seen',
    alias: 'addToSeen',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'put',
    path: '/rate',
    alias: 'rateMovie',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: RateMovieDataSchema,
      },
    ],
    response: TokenResponseSchema,
  }, {
    method: 'delete',
    path: '/seen',
    alias: 'removeFromSeen',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: IdSchema,
      },
    ],
    response: z.void(),
  }, {
    method: 'delete',
    path: '/rate',
    alias: 'deleteRating',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: DeleteRatingDataSchema,
      },
    ],
    response: z.void(),
  },
]);

// ============================================
// Query Keys
// ============================================

export const userKeys = {
  all: ['users'] as const,
  detail: () => [...userKeys.all, 'detail'] as const,
  watchlist: () => [...userKeys.all, 'watchlist'] as const,
  favorites: () => [...userKeys.all, 'favorites'] as const,
  seen: () => [...userKeys.all, 'seen'] as const,
  ratings: () => [...userKeys.all, 'ratings'] as const,
};

// ============================================
// Query Hooks
// ============================================

export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.detail(),
    queryFn: zodiosClient.getCurrentUser,
  });
};

export const useWatchlist = () => {
  return useQuery({
    queryKey: userKeys.watchlist(),
    queryFn: zodiosClient.getWatchlist,
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: userKeys.favorites(),
    queryFn: zodiosClient.getFavorites,
  });
};

export const useSeen = () => {
  return useQuery({
    queryKey: userKeys.seen(),
    queryFn: zodiosClient.getSeen,
  });
};

export const useRatings = () => {
  return useQuery({
    queryKey: userKeys.ratings(),
    queryFn: zodiosClient.getRatings,
  });
};

// ============================================
// Mutation Hooks
// ============================================

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) => zodiosClient.login(credentials),
    onSuccess: async (token: string) => {
      await AsyncStorage.setItem('token', token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) => zodiosClient.register(data),
    onSuccess: async (token: string) => {
      await AsyncStorage.setItem('token', token);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: { email: string }) => {
      const response = await zodiosClient.forgotPassword(data);
      logger.debug('Forgot password response received', { context: 'useForgotPassword' });
      return response;
    },
    onSuccess: async (token: string) => {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    },
    onError: (error) => {
      logger.error('Forgot password failed', error, { context: 'useForgotPassword' });
    },
  });
};

export const useCheckCode = () => {
  return useMutation({
    mutationFn: (data: { code: string }) => zodiosClient.checkCode(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { password: string }) => zodiosClient.changePassword(data),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { name?: string; email?: string; img?: string }) => zodiosClient.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUserImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { img: string }) => zodiosClient.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.addToWatchlist({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.watchlist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.removeFromWatchlist({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.watchlist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.addToFavorites({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.removeFromFavorites({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useAddToSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.addToSeen({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.seen() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => zodiosClient.removeFromSeen({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.seen() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string; rating: number }) => zodiosClient.rateMovie(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['users', 'ratings'] });
    },
  });
};

export const useDeleteUser = () => {
  const clearCache = useClearCache();
  
  return useMutation({
    mutationFn: (data: { id: string }) => zodiosClient.deleteUser(data),
    onSuccess: () => {
      clearCache();
      AsyncStorage.removeItem('token');
    },
  });
};
