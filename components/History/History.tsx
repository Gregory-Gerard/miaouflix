'use client';

import { useFetchWatchedMovies } from '@/hooks/use-fetch-watched-movies';
import EditHistoryCard from '@/components/History/EditHistoryCard';
import MovieCard from '@/components/History/MovieCard';
import EmptyState from '@/components/History/EmptyState';
import Loading from '@/components/History/Loading';

export default function History() {
  const fetchWatchedMovies = useFetchWatchedMovies();

  return (
    <div>
      {fetchWatchedMovies.loading && <Loading />}

      {!fetchWatchedMovies.loading && fetchWatchedMovies.movies.length > 0 && (
        <div className="flex flex-col gap-16">
          <div>
            <h1 className="mb-4 text-xl font-bold">Tes films favoris</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {fetchWatchedMovies.movies.map((movie) => (
                <MovieCard key={movie.id} title={movie.title} images={movie.images} times={movie.times} />
              ))}
            </div>
          </div>

          <div>
            <strong className="mb-2 block text-xl font-bold">Modifier l&apos;historique</strong>
            <small className="mb-6 block leading-none text-neutral-400">
              Ajoute ou modifie le nombre de fois que t&apos;as vu un film ici
            </small>
            <EditHistoryCard refetch={fetchWatchedMovies.refetch} />
          </div>
        </div>
      )}

      {!fetchWatchedMovies.loading && fetchWatchedMovies.movies.length === 0 && <EmptyState />}
    </div>
  );
}
