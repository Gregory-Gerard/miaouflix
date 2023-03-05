import Image from 'next/image';
import { Movie } from '@/types/tmdb/movies';
import { PlayIcon, StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function HighlightMovie({
  title,
  images,
  tagline,
  vote_average,
}: Pick<Movie, 'title' | 'images' | 'tagline' | 'vote_average'>) {
  const background = images.backdrops[0].file_path ? (
    <Image
      src={images.backdrops[0].file_path}
      alt={title}
      fill={true}
      className="-z-10 object-cover"
    />
  ) : (
    <div className="h-full w-full bg-neutral-800"></div>
  );
  const logo = images.logos[0].file_path ? (
    <Image
      src={images.logos[0].file_path}
      alt={title}
      width={images.logos[0].width}
      height={images.logos[0].height}
      className="w-64"
    />
  ) : (
    <h2 className="w-min text-4xl font-bold tracking-tight">{title}</h2>
  );

  return (
    <section className="relative flex h-[max(calc(100vh_-_200px),500px)] w-screen flex-col justify-center">
      <div className="container mx-auto flex flex-col items-start gap-8">
        <Stars nb={vote_average / 2} />
        {logo}
        <PlayButton title={title} />
      </div>
      <div className="absolute -z-10 h-full w-full before:absolute before:inset-0 before:bg-gradient-to-r before:from-neutral-900/90">
        {background}
      </div>
    </section>
  );
}

function Stars({ nb }: { nb: number }) {
  const normalizedNbStars = Math.round(nb);
  const missingStars = 5 - normalizedNbStars;

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full bg-neutral-800 px-2 py-1">
      {[...Array(normalizedNbStars)].map((_, i) => (
        <StarIcon key={i} className="w-4 text-red-500" />
      ))}
      {[...Array(missingStars)].map((_, i) => (
        <StarIcon key={i} className="w-4 text-neutral-700" />
      ))}
      <span className="text-xs lining-nums tabular-nums leading-none text-neutral-600">
        {nb.toPrecision(3)} sur 5
      </span>
    </div>
  );
}

function PlayButton({ title }: Pick<Movie, 'title'>) {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 rounded-xl bg-neutral-200 py-2 pl-6 pr-8 font-bold text-neutral-900 shadow transition-all hover:bg-neutral-300 hover:shadow-xl"
      title={`Lancer ${title}`}
    >
      <PlayIcon className="w-4" />
      Lancer
    </Link>
  );
}
