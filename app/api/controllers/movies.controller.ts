import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeApi } from '@zodios/core';
import { z } from 'zod';
import { zodiosClient } from '../zodiosClient';
import type { FilteredMoviesData } from '../schemas';
import {
  AddQuoteDataSchema,
  AverageRatingSchema,
  FilteredMoviesDataSchema,
  MoviesArraySchema,
  QuoteOrArraySchema,
  QuoteSchema,
  SearchMovieDataSchema,
  UpdateMovieRatingDataSchema,
} from '../schemas';

// ============================================
// Movie API Definition
// ============================================

export const movieApi = makeApi([
  {
    method: 'post',
    path: '/getMovies',
    alias: 'getMovies',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({}),
      },
    ],
    response: MoviesArraySchema,
  },
  {
    method: 'get',
    path: '/quote',
    alias: 'getQuote',
    response: QuoteOrArraySchema,
  },
  {
    method: 'get',
    path: '/avgRating/:id',
    alias: 'getAverageRating',
    parameters: [
      {
        name: 'id',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: AverageRatingSchema,
  },
  {
    method: 'post',
    path: '/quote',
    alias: 'addQuote',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: AddQuoteDataSchema,
      },
    ],
    response: QuoteSchema,
  },
  {
    method: 'post',
    path: '/filteredMovies',
    alias: 'getFilteredMovies',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: FilteredMoviesDataSchema,
      },
    ],
    response: MoviesArraySchema,
  },
  {
    method: 'post',
    path: '/findByTitle',
    alias: 'searchMovies',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: SearchMovieDataSchema,
      },
    ],
    response: MoviesArraySchema,
  },
  {
    method: 'put',
    path: '/updateRating',
    alias: 'updateMovieRating',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: UpdateMovieRatingDataSchema,
      },
    ],
    response: z.void(),
  },
]);

// ============================================
// Query Keys
// ============================================

export const movieKeys = {
  all: ['movies'] as const,
  lists: () => [...movieKeys.all, 'list'] as const,
  list: (filters?: string) => [...movieKeys.lists(), filters] as const,
  details: () => [...movieKeys.all, 'detail'] as const,
  detail: (id: string) => [...movieKeys.details(), id] as const,
  quotes: () => [...movieKeys.all, 'quotes'] as const,
  quote: () => [...movieKeys.quotes(), 'current'] as const,
  avgRating: (id: string) => [...movieKeys.all, 'avgRating', id] as const,
  search: (query: string) => [...movieKeys.all, 'search', query] as const,
};

// ============================================
// Query Hooks
// ============================================

export const useMovies = () => {
  return useQuery({
    queryKey: movieKeys.list(),
    queryFn: () => zodiosClient.getMovies({}),
    staleTime: 10 * 60 * 1000, // 10 minutes,
  });
};

export const useQuote = () => {
  return useQuery({
    queryKey: movieKeys.quote(),
    queryFn: async () => {
      const result = await zodiosClient.getQuote();
      // Handle both single quote and array of quotes
      return Array.isArray(result) ? result[0] : result;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAverageRating = (movieId: string) => {
  return useQuery({
    queryKey: movieKeys.avgRating(movieId),
    queryFn: () => zodiosClient.getAverageRating({ params: { id: movieId } }),
    enabled: !!movieId,
  });
};

export const useFilteredMovies = (filters: FilteredMoviesData, enabled: boolean = true) => {
  return useQuery({
    queryKey: movieKeys.list(JSON.stringify(filters)),
    queryFn: () => zodiosClient.getFilteredMovies(filters),
    enabled,
  });
};

export const useSearchMovies = (searchQuery: string) => {
  return useQuery({
    queryKey: movieKeys.search(searchQuery),
    queryFn: () => zodiosClient.searchMovies({ search: searchQuery }),
    enabled: searchQuery.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ============================================
// Mutation Hooks
// ============================================

export const useAddQuote = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { quote: string; subquote: string }) => zodiosClient.addQuote(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.quote() });
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string }) => zodiosClient.deleteRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['users', 'ratings'] });
    },
  });
};

export const useUpdateMovieRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { id: string }) => zodiosClient.updateMovieRating(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
    },
  });
};
