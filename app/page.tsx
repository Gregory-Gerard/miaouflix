import { getMovie } from '@/services/tmdb/movies';
import prisma from '@/prisma/prisma';
import { Movie } from '@/types/tmdb/movies';
import HighlightMovie from '@/components/HighlightMovie';

export const revalidate = 43200; // 60 * 60 * 12

export default async function Page() {
  const randomMovie = await retrieveOneRandomMovie();

  return (
    <div>
      <h1 className="sr-only">Accueil Miaouflix</h1>

      <HighlightMovie
        title={randomMovie.title}
        images={randomMovie.images}
        tagline={randomMovie.tagline}
        vote_average={randomMovie.vote_average}
      />
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
  ).tmdbId;

  return await getMovie(randomMovieTMDBId);
}
