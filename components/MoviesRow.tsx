import { Movie } from '@/types/tmdb/movies';
import Image from 'next/image';
import Link from 'next/link';

type MoviesRowProps = {
  title: string;
  movies: Movie[];
};

export default function MoviesRow({ title, movies }: MoviesRowProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-bold tracking-wide">{title}</h2>

      <div className="-mx-4 grid auto-cols-posters grid-flow-col grid-cols-posters gap-4 overflow-x-auto p-4">
        {movies.map((movie) => (
          <MoviePoster key={movie.id} id={movie.id} title={movie.title} images={movie.images} />
        ))}
      </div>
    </div>
  );
}

function MoviePoster({ id, title, images }: Pick<Movie, 'id' | 'title' | 'images'>) {
  const poster = images.posters[0].file_path ? (
    <Image
      src={images.posters[0].file_path}
      alt={`Poster de ${title}`}
      fill={true}
      className="object-cover"
      sizes="(max-width: 768px): 33vw,
              10vw"
    />
  ) : (
    <div className="h-full w-full bg-neutral-800" />
  );

  return (
    <Link
      href={`/movies/${id}`}
      className="relative block aspect-poster overflow-hidden rounded-xl shadow transition-all hover:scale-105 hover:opacity-90 hover:shadow-xl"
    >
      {poster}
    </Link>
  );
}
