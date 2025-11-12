import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../client';
import type { User, Movie } from '../../types';

// ============================================
// Types
// ============================================

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type CheckCodeData = {
  code: string;
};

export type ChangePasswordData = {
  password: string;
};

export type UpdateUserImageData = {
  img: string;
};

export type UpdateUserData = {
  name?: string;
  email?: string;
  img?: string;
};

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
// API Functions
// ============================================

const userApi = {
  // GET requests
  getCurrentUser: () => apiClient.get<User>('/users/'),
  getUser: () => apiClient.get<User>('/users'),
  getWatchlist: () => apiClient.get<Array<Movie>>('/users/watchlist'),
  getFavorites: () => apiClient.get<Array<Movie>>('/users/favorites'),
  getSeen: () => apiClient.get<Array<Movie>>('/users/seen'),
  getRatings: () => apiClient.get<Array<Movie>>('/users/rate'),

  // POST requests
  login: (credentials: LoginCredentials) => 
    apiClient.post<string>('/users/login', credentials),
  register: (data: RegisterData) => 
    apiClient.post<string>('/users/', data),
  forgotPassword: (data: ForgotPasswordData) => 
    apiClient.post<string>('/users/forgotPassword', data),
  checkCode: (data: CheckCodeData) => 
    apiClient.post<string>('/users/checkCode', data),

  // PUT requests
  changePassword: (data: ChangePasswordData) => 
    apiClient.put<string>('/users/changePassword', data),
  updateUser: (data: UpdateUserData) =>
    apiClient.put<User>('/users/', data),
  updateUserImage: (data: UpdateUserImageData) => 
    apiClient.put<User>('/users/', data),
  addToWatchlist: (id: string) => 
    apiClient.put<string>('/users/watchlist', { id }),
  addToFavorites: (id: string) => 
    apiClient.put<string>('/users/favorites', { id }),
  addToSeen: (id: string) => 
    apiClient.put<string>('/users/seen', { id }),

  // DELETE requests
  removeFromWatchlist: (id: string) => 
    apiClient.delete<string>('/users/watchlist', { id }),
  removeFromFavorites: (id: string) => 
    apiClient.delete<string>('/users/favorites', { id }),
  removeFromSeen: (id: string) => 
    apiClient.delete<string>('/users/seen', { id }),
};

// ============================================
// Query Hooks
// ============================================

export const useCurrentUser = () => {
  return useQuery({
    queryKey: userKeys.detail(),
    queryFn: userApi.getCurrentUser,
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: userApi.getUser,
  });
};

export const useWatchlist = () => {
  return useQuery({
    queryKey: userKeys.watchlist(),
    queryFn: userApi.getWatchlist,
  });
};

export const useFavorites = () => {
  return useQuery({
    queryKey: userKeys.favorites(),
    queryFn: userApi.getFavorites,
  });
};

export const useSeen = () => {
  return useQuery({
    queryKey: userKeys.seen(),
    queryFn: userApi.getSeen,
  });
};

export const useRatings = () => {
  return useQuery({
    queryKey: userKeys.ratings(),
    queryFn: userApi.getRatings,
  });
};

// ============================================
// Mutation Hooks
// ============================================

export const useLogin = () => {
  return useMutation({
    mutationFn: userApi.login,
    onSuccess: async (token) => {
      await AsyncStorage.setItem('token', token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userApi.register,
    onSuccess: async (token) => {
      await AsyncStorage.setItem('token', token);
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: userApi.forgotPassword,
    onSuccess: async (token) => {
      await AsyncStorage.setItem('token', token);
    },
  });
};

export const useCheckCode = () => {
  return useMutation({
    mutationFn: userApi.checkCode,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: userApi.changePassword,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useUpdateUserImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.updateUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.addToWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.watchlist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.removeFromWatchlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.watchlist() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.addToFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useAddToSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.addToSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.seen() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};

export const useRemoveFromSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.removeFromSeen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.seen() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail() });
    },
  });
};
