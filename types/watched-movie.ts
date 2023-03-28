import { z } from 'zod';

export const WatchedMovie = z.object({
  tmdbId: z.number(),
  date: z
    .string()
    .datetime()
    .transform((val) => new Date(val)),
});

export type WatchedMovie = z.infer<typeof WatchedMovie>;
