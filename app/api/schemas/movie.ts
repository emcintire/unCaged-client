import { z } from 'zod';
import { MovieRatingSchema } from './movieRating';

export const MovieSchema = z.object({
  _id: z.string(),
  avgRating: z.number().optional(),
  date: z.string(),
  description: z.string().optional(),
  director: z.string(),
  genres: z.array(z.string()),
  img: z.string(),
  rating: z.string(),
  ratings: z.array(MovieRatingSchema),
  runtime: z.string(),
  title: z.string(),
});

export type Movie = z.infer<typeof MovieSchema>;
