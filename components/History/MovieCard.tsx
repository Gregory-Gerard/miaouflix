import Image from 'next/image';
import { Movie } from '@/types/tmdb/movies';

export default function MovieCard({ title, images, times }: Pick<Movie, 'title' | 'images'> & { times: number }) {
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
      <strong className="truncate">{title}</strong>
      <small className="text-neutral-300">Vu {times} fois</small>
      <div className="absolute inset-0 -z-10 h-full w-full before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-neutral-950">
        {background}
      </div>
    </div>
  );
}
