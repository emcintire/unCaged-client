import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Movie } from '../../types';

// ============================================
// Types
// ============================================

export type Quote = {
  quote: string;
  subquote: string;
};

export type AddQuoteData = {
  quote: string;
  subquote: string;
};

export type RateMovieData = {
  id: string;
  rating: number;
};

export type DeleteRatingData = {
  id: string;
};

export type UpdateMovieRatingData = {
  id: string;
};

export type FilteredMoviesData = {
  seen: boolean;
  rotten: boolean;
  time: number;
  genres: string[];
  min: number;
  max: number;
};

export type SearchMovieData = {
  search: string;
};

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
// API Functions
// ============================================

const movieApi = {
  // GET requests
  getMovies: () => apiClient.post<Movie[]>('/movies/getMovies'),
  getQuote: () => apiClient.get<Quote | Quote[]>('/movies/quote'),
  getAverageRating: (id: string) => apiClient.get<any>(`/movies/avgRating/${id}`),

  // POST requests
  addQuote: (data: AddQuoteData) => apiClient.post<Quote>('/movies/quote', data),
  getFilteredMovies: (data: FilteredMoviesData) => 
    apiClient.post<Movie[]>('/movies/filteredMovies', data),
  searchMovies: (data: SearchMovieData) => 
    apiClient.post<Movie[]>('/movies/findByTitle', data),
  rateMovie: (data: RateMovieData) => 
    apiClient.post<string>('/users/rate', data),

  // PUT requests
  updateMovieRating: (data: UpdateMovieRatingData) => 
    apiClient.put<any>('/movies/updateRating', data),

  // DELETE requests
  deleteRating: (data: DeleteRatingData) => 
    apiClient.delete<string>('/users/rate', data),
};

// ============================================
// Query Hooks
// ============================================

export const useMovies = () => {
  return useQuery({
    queryKey: movieKeys.list(),
    queryFn: movieApi.getMovies,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useQuote = () => {
  return useQuery({
    queryKey: movieKeys.quote(),
    queryFn: async () => {
      const result = await movieApi.getQuote();
      // Handle both single quote and array of quotes
      return Array.isArray(result) ? result[0] : result;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useAverageRating = (movieId: string) => {
  return useQuery({
    queryKey: movieKeys.avgRating(movieId),
    queryFn: () => movieApi.getAverageRating(movieId),
    enabled: !!movieId,
  });
};

export const useFilteredMovies = (filters: FilteredMoviesData, enabled: boolean = true) => {
  return useQuery({
    queryKey: movieKeys.list(JSON.stringify(filters)),
    queryFn: () => movieApi.getFilteredMovies(filters),
    enabled,
  });
};

export const useSearchMovies = (searchQuery: string) => {
  return useQuery({
    queryKey: movieKeys.search(searchQuery),
    queryFn: () => movieApi.searchMovies({ search: searchQuery }),
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
    mutationFn: movieApi.addQuote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: movieKeys.quote() });
    },
  });
};

export const useRateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: movieApi.rateMovie,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['users', 'ratings'] });
    },
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: movieApi.deleteRating,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['users', 'ratings'] });
    },
  });
};

export const useUpdateMovieRating = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: movieApi.updateMovieRating,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: movieKeys.avgRating(variables.id) });
    },
  });
};
