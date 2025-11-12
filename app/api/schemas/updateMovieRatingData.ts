import { z } from 'zod';

export const UpdateMovieRatingDataSchema = z.object({
  id: z.string(),
});

export type UpdateMovieRatingData = z.infer<typeof UpdateMovieRatingDataSchema>;
