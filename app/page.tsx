import { getMovie } from '@/services/tmdb/movies';
import prisma from '@/prisma/prisma';
import { Movie } from '@/types/tmdb/movies';
import HighlightMovie from '@/components/HighlightMovie';
import MoviePoster from '@/components/MoviePoster';
import Navbar from '@/components/Navbar';
import Roulette from '@/components/Roulette';
import React from 'react';

export const revalidate = 43200; // 60 * 60 * 12

export default async function Page() {
  const [randomMovie, movies] = await Promise.all([retrieveOneRandomMovie(), retrieveMovies()]);

  return (
    <div>
      <Navbar />

      <h1 className="sr-only">Accueil Miaouflix</h1>

      <HighlightMovie
        id={randomMovie.id}
        title={randomMovie.title}
        images={randomMovie.images}
        tagline={randomMovie.tagline}
        vote_average={randomMovie.vote_average}
      />

      <div className="-translate-y-16">
        <div className="container flex flex-col gap-4">
          <Roulette movies={movies} />
          <section className="flex flex-col gap-4">
            <h2 className="text-xl font-bold tracking-wide">Tous les films</h2>
            <div className="grid grid-cols-posters justify-between gap-4">
              {movies.map((movie) => (
                <MoviePoster
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  src={movie.images.posters[0]?.file_path}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

async function retrieveOneRandomMovie(): Promise<Movie> {
  const moviesCount = await prisma.movie.count();

  const randomMovieTMDBId = (
    await prisma.movie.findFirstOrThrow({
      take: 1,
      skip: Math.floor(Math.random() * moviesCount),
    })
  ).id;

  return await getMovie(randomMovieTMDBId);
}

async function retrieveMovies(): Promise<Movie[]> {
  const movies = await prisma.movie.findMany({ orderBy: { title: 'asc' } });

  return Promise.all(movies.map((movie) => getMovie(movie.id)));
}
