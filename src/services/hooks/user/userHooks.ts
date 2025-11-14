import * as SecureStore from 'expo-secure-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { STORAGE_KEYS } from '@/constants';
import { logger } from '@/utils/logger';
import { useClearCache } from '@/hooks';
import { zodiosClient } from '../../zodiosClient';
import { userKeys } from './userKeys';
import { movieKeys } from '../movie';

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
      await SecureStore.setItemAsync('token', token);
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: { name: string; email: string; password: string }) => zodiosClient.register(data),
    onSuccess: async (token: string) => {
      await SecureStore.setItemAsync('token', token);
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
      await SecureStore.setItemAsync(STORAGE_KEYS.AUTH_TOKEN, token);
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
      queryClient.invalidateQueries({ queryKey: userKeys.ratings() });
    },
  });
};

export const useDeleteUser = () => {
  const clearCache = useClearCache();
  
  return useMutation({
    mutationFn: (data: { id: string }) => zodiosClient.deleteUser(data),
    onSuccess: () => {
      clearCache();
      SecureStore.deleteItemAsync('token');
    },
  });
};
