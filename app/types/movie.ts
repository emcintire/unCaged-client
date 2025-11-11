import type { MovieRating } from './movieRating';

export type Movie = {
  _id: string;
  avgRating?: number | undefined;
  date: string;
  description?: string | undefined;
  director: string;
  genres: Array<string>;
  img: string;
  rating: string;
  ratings: Array<MovieRating>;
  runtime: string;
  title: string;
};
