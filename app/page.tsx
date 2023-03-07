import { getMovie } from '@/services/tmdb/movies';
import prisma from '@/prisma/prisma';
import { Movie } from '@/types/tmdb/movies';
import HighlightMovie from '@/components/HighlightMovie';
import MoviesRow from '@/components/MoviesRow';
import { Category } from '@prisma/client';
import Navbar from '@/components/Navbar';
import React from 'react';

export const revalidate = 43200; // 60 * 60 * 12

export default async function Page() {
  const [randomMovie, categoriesWithMovies] = await Promise.all([
    retrieveOneRandomMovie(),
    retrieveCategoriesWithMovies(),
  ]);

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
          {categoriesWithMovies.map((categoryWithMovies) => (
            <MoviesRow
              key={categoryWithMovies.id}
              title={categoryWithMovies.title}
              movies={categoryWithMovies.movies}
            />
          ))}
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

async function retrieveCategoriesWithMovies(): Promise<(Category & { movies: Movie[] })[]> {
  const categoriesWithMovies = await prisma.category.findMany({
    include: {
      movies: true,
    },
  });
  const categoriesWithMoviesLoaded: Awaited<ReturnType<typeof retrieveCategoriesWithMovies>> = [];

  for (const i in categoriesWithMovies) {
    categoriesWithMoviesLoaded[i] = {
      id: categoriesWithMovies[i].id,
      title: categoriesWithMovies[i].title,
      movies: await Promise.all(categoriesWithMovies[i].movies.map(async (movie) => await getMovie(movie.id))),
    };
  }

  return categoriesWithMoviesLoaded;
}
