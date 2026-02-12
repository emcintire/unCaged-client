import { makeApi } from '@zodios/core';
import { z } from 'zod';
import {
  AddQuoteDataSchema,
  AverageRatingSchema,
  CreateMovieDataSchema,
  FilteredMoviesDataSchema,
  MovieSchema,
  MoviesArraySchema,
  QuoteOrArraySchema,
  QuoteSchema,
  SearchMovieDataSchema,
  UpdateMovieRatingDataSchema,
} from '../schemas';

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
  }, {
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
  }, {
    method: 'put',
    path: '/updateRatings',
    alias: 'updateMovieRatings',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: z.object({}),
      },
    ],
    response: z.void(),
  },
  {
    method: 'post',
    path: '/',
    alias: 'createMovie',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: CreateMovieDataSchema,
      },
    ],
    response: MovieSchema,
  },
]);
