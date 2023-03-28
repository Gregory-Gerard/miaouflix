import { WatchedMovie } from '@/types/watched-movie';

const LOCALSTORAGE_WATCHED_MOVIES_KEY = 'watchedMovies';

export const getWatchedMovies = (): WatchedMovie[] => {
  const watchedMovies = WatchedMovie.array().safeParse(
    JSON.parse(localStorage.getItem(LOCALSTORAGE_WATCHED_MOVIES_KEY) || '{}')
  );

  return watchedMovies.success ? watchedMovies.data : [];
};

export const addWatchedMovie = (watchedMovie: WatchedMovie): void => {
  const watchedMovies = getWatchedMovies();

  if (
    // already watched this movie today ?
    watchedMovies.some(
      (movie) =>
        movie.tmdbId === watchedMovie.tmdbId &&
        movie.date.getDate() === watchedMovie.date.getDate() &&
        movie.date.getMonth() === watchedMovie.date.getMonth() &&
        movie.date.getFullYear() === watchedMovie.date.getFullYear()
    )
  ) {
    return;
  }

  localStorage.setItem(LOCALSTORAGE_WATCHED_MOVIES_KEY, JSON.stringify([watchedMovie, ...watchedMovies]));
};
