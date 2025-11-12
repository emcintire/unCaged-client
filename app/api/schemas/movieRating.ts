import { z } from 'zod';

export const MovieRatingSchema = z.object({
  id: z.string(),
  rating: z.number(),
});

export type MovieRating = z.infer<typeof MovieRatingSchema>;
