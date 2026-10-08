import { Movie } from '@/types/tmdb/movies';
import MoviePoster from '@/components/MoviePoster';

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
          <MoviePoster key={movie.id} id={movie.id} title={movie.title} src={movie.images.posters[0]?.file_path} />
        ))}
      </div>
    </div>
  );
}
