import { Movie } from '@/types/tmdb/movies';
import { WatchedMovie } from '@/types/watched-movie';
import { useEffect, useMemo, useState } from 'react';
import { getWatchedMovies } from '@/services/watched-movie';
import { fetchData } from '@/services/fetchData';

type UseFetchWatchedMoviesReturnType =
  | {
      loading: true;
    }
  | {
      loading: false;
      movies: MovieWithTimesWatched[];
      refetch: () => void;
    };

type MovieWithTimesWatched = Movie & { times: number };

// Load `localStorage` data only on client-side
let watchedMoviesFromLocalStorage: WatchedMovie[] = [];
if (typeof window !== 'undefined') {
  watchedMoviesFromLocalStorage = getWatchedMovies();
}

/**
 * Custom hook to fetch and normalize watched movies data.
 *
 * @returns {UseFetchWatchedMoviesReturnType}
 */
export function useFetchWatchedMovies(): UseFetchWatchedMoviesReturnType {
  const [loading, setLoading] = useState<boolean>(true);
  const [movies, setMovies] = useState<Movie[]>([]);
  const normalizedMovies = useMemo(() => normalizeMovies(movies), [movies]);

  const fetchMoviesData = () => {
    const watchedMovieIds = new Set(watchedMoviesFromLocalStorage.map((movie) => movie.tmdbId));

    Movie.array()
      .promise()
      .parse(fetchData(`/api/history?tmdbIds=${JSON.stringify([...watchedMovieIds])}`))
      .then((movies) => setMovies(movies))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (watchedMoviesFromLocalStorage.length === 0) {
      setLoading(false);
      return;
    }

    fetchMoviesData();
  }, []);

  return loading
    ? { loading: true }
    : {
        loading: false,
        movies: normalizedMovies,
        refetch: () => {
          watchedMoviesFromLocalStorage = getWatchedMovies();
          fetchMoviesData();
        },
      };
}

/**
 * Normalize the list of movies by adding a field with the number of views (times) and sorting
 * the films by this same field.
 *
 * @param {Movie[]} movies
 *
 * @returns {MovieWithTimesWatched[]}
 */
function normalizeMovies(movies: Movie[]): MovieWithTimesWatched[] {
  if (movies.length === 0) {
    return [];
  }

  const watchedMoviesWithData = watchedMoviesFromLocalStorage.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.tmdbId]: {
        ...filterMovieById(currentValue.tmdbId, movies),
        times: (previousValue[currentValue.tmdbId]?.times || 0) + 1,
      },
    }),
    {} as Record<number, MovieWithTimesWatched>,
  );

  return Object.values(watchedMoviesWithData).sort((a, b) => b.times - a.times);
}

function filterMovieById(id: number, movies: Movie[]): Movie {
  const movie = movies.find((movie) => movie.id === id);

  if (!movie) {
    throw 'Movie not found';
  }

  return movie;
}
