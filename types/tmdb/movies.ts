import { z } from 'zod';
import { TMDB_IMAGE_BASE_URL } from '@/services/tmdb/common';

const TMDBFilePath = z
  .string()
  .nullable()
  .transform((val) =>
    val
      ? `${TMDB_IMAGE_BASE_URL}/original/${val.trim().replace(/^\/+/, '')}`
      : val
  );

export const Movie = z.object({
  id: z.number(),
  title: z.string(),
  overview: z.string().nullable(),
  popularity: z.number(),
  vote_average: z.number(),
  vote_count: z.number(),
  backdrop_path: TMDBFilePath,
  budget: z.number(),
  runtime: z.number().nullable(),
  tagline: z.string().nullable(),
  release_date: z.string(),
  images: z.object({
    backdrops: z
      .object({
        width: z.number(),
        height: z.number(),
        file_path: TMDBFilePath,
        vote_average: z.number(),
        vote_count: z.number(),
      })
      .array(),
    posters: z
      .object({
        width: z.number(),
        height: z.number(),
        file_path: TMDBFilePath,
        vote_average: z.number(),
        vote_count: z.number(),
      })
      .array(),
    logos: z
      .object({
        width: z.number(),
        height: z.number(),
        file_path: TMDBFilePath,
        vote_average: z.number(),
        vote_count: z.number(),
      })
      .array(),
  }),
});

export type Movie = z.infer<typeof Movie>;
