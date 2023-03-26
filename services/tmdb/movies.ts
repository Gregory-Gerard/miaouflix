import { url } from '@/services/tmdb/common';
import { Movie } from '@/types/tmdb/movies';

export const getMovie = (id: number): Promise<Movie> =>
  fetch(
    url(`/movie/${id}`, {
      append_to_response: 'images',
      include_image_language: 'en,null',
    }),
    {
      next: {
        revalidate: 43200, // 60 * 60 * 12
      },
    }
  )
    .then((res) => res.json())
    .then((data) => Movie.parse(data));
