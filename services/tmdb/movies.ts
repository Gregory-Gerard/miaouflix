import { url } from '@/services/tmdb/common';
import { Movie } from '@/types/tmdb/movies';
export const getMovie = (id: number) =>
  fetch(
    url(`/movie/${id}`, {
      append_to_response: 'images',
      include_image_language: 'en,null',
    })
  )
    .then((res) => res.json())
    .then((data) => Movie.parse(data));
