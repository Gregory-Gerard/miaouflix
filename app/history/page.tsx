'use client';

import Navbar from '@/components/Navbar';
import { getWatchedMovies, WatchedMovies } from '@/services/watched-movies';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Movie } from '@/types/tmdb/movies';
import Image from 'next/image';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <Navbar />
      <section className="container pt-32">
        <WatchedMovies />
      </section>
    </>
  );
}

const cache = new Map();
export function fetchData(url: string): Promise<unknown> {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((res) => res.json())
    );
  }

  return cache.get(url);
}

function WatchedMovies() {
  const [loading, setLoading] = useState<boolean>(true);
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [localWatchedMovies, setLocalWatchedMovies] = useState<WatchedMovies>([]);

  useEffect(() => {
    const watchedMovies = getWatchedMovies();
    setLocalWatchedMovies(watchedMovies);

    if (watchedMovies.length === 0) {
      setLoading(false);
      return;
    }

    Movie.array()
      .promise()
      .parse(fetchData(`/api/history?tmdbIds=${JSON.stringify(watchedMovies.map((movie) => movie.tmdbId))}`))
      .then((movies) => setWatchedMovies(movies))
      .finally(() => setLoading(false));
  }, []);

  const sortedWatchedMovies = useSortedWatchedMovies(watchedMovies, localWatchedMovies);

  return (
    <div>
      {loading && <Loading />}

      {sortedWatchedMovies.length > 0 && !loading && (
        <div>
          <h1 className="mb-4 text-xl font-bold">Tes films favoris</h1>
          <div className="grid grid-cols-3">
            {sortedWatchedMovies.map((movie) => (
              <MovieCard key={movie.id} title={movie.title} images={movie.images} times={movie.times} />
            ))}
          </div>
        </div>
      )}

      {sortedWatchedMovies.length === 0 && !loading && <EmptyState />}
    </div>
  );
}

const useSortedWatchedMovies = (watchedMovies: Movie[], localWatchedMovies: WatchedMovies) => {
  const getMovieById = useCallback(
    (id: number) => {
      const movie = watchedMovies.find((movie) => movie.id === id);

      if (!movie) {
        throw 'Movie not found';
      }

      return movie;
    },
    [watchedMovies]
  );

  return useMemo(() => {
    if (watchedMovies.length === 0) {
      return [];
    }

    return [
      ...Object.values(
        localWatchedMovies.reduce(
          (previousValue, currentValue) => ({
            ...previousValue,
            [currentValue.tmdbId]: {
              ...getMovieById(currentValue.tmdbId),
              times: (previousValue[currentValue.tmdbId]?.times || 0) + 1,
            },
          }),
          {} as Record<number, Movie & { times: number }>
        )
      ),
    ].sort((a, b) => a.times - b.times);
  }, [getMovieById, localWatchedMovies, watchedMovies.length]);
};

function MovieCard({ title, images, times }: Pick<Movie, 'title' | 'images'> & { times: number }) {
  const background = images.backdrops[0].file_path ? (
    <Image
      src={images.backdrops[0].file_path}
      alt={title}
      fill={true}
      className="-z-10 object-cover"
      sizes="(max-width: 768px): 50vw,
              33vw"
    />
  ) : (
    <div className="h-full w-full bg-neutral-800"></div>
  );

  return (
    <div className="relative flex aspect-video flex-col justify-end overflow-hidden rounded-2xl p-4 shadow-outline">
      <strong>{title}</strong>
      <small className="text-neutral-300">Vu {times} fois</small>
      <div className="absolute inset-0 -z-10 h-full w-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-neutral-900">
        {background}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-full bg-red-500/30 p-2 text-red-200 ring-4 ring-red-500/20">
        <MagnifyingGlassIcon className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-medium">Aucun film visionné</h1>
        <p className="text-sm text-neutral-300">
          Il est l&apos;heure d&apos;aller regarder un film et de remplir cette liste !
        </p>
      </div>
      <Link
        href="/"
        className="rounded-xl bg-neutral-200 py-2 px-8 font-bold text-neutral-900 shadow transition-all hover:bg-neutral-300 hover:shadow-xl"
      >
        Retourner vers l&apos;accueil
      </Link>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center justify-center">
      <svg
        className="h-5 w-5 animate-spin text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  );
}
