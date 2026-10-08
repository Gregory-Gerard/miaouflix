import Image, { ImageProps } from 'next/image';
import Link from 'next/link';
import { Movie } from '@/types/tmdb/movies';

export default function MoviePoster({
  id,
  title,
  src,
  loading,
}: Pick<Movie, 'id' | 'title'> & { src?: string | null } & Pick<ImageProps, 'loading'>) {
  const poster = src ? (
    <Image
      src={src}
      alt={`Poster de ${title}`}
      fill={true}
      className="object-cover"
      loading={loading}
      sizes="(max-width: 768px): 33vw,
              10vw"
    />
  ) : (
    <div className="h-full w-full bg-neutral-800" />
  );

  return (
    <Link
      href={`/movies/${id}`}
      className="relative block aspect-poster overflow-hidden rounded-xl shadow-sm transition-all hover:scale-105 hover:opacity-90 hover:shadow-xl"
    >
      {poster}
    </Link>
  );
}
