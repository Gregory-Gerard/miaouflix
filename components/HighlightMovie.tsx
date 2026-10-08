import Image from 'next/image';
import { Movie } from '@/types/tmdb/movies';
import { PlayIcon, StarIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import Button from '@/components/Button';

export default function HighlightMovie({
  id,
  title,
  images,
  tagline,
  vote_average,
}: Pick<Movie, 'id' | 'title' | 'images' | 'tagline' | 'vote_average'>) {
  const backdrop = images.backdrops[0]?.file_path;
  const logoPath = images.logos[0]?.file_path;
  const background = backdrop ? (
    <Image src={backdrop} alt={title} fill={true} className="-z-10 object-cover" priority={true} />
  ) : (
    <div className="h-full w-full bg-neutral-800"></div>
  );
  const logo = logoPath ? (
    <Image src={logoPath} alt={title} width={300} height={80} className="-order-1 object-contain" priority={true} />
  ) : (
    <h2 className="w-min text-4xl font-bold tracking-tight">{title}</h2>
  );

  return (
    <section className="relative flex h-[600px] w-screen flex-col justify-end pb-24 md:h-[700px] md:justify-center md:pb-0">
      <div className="container flex flex-col items-center gap-8 text-center md:items-start md:text-left">
        <Stars nb={vote_average / 2} />
        {logo}
        <p className="hidden w-72 text-sm font-medium tracking-wide text-neutral-200 md:block">{tagline}</p>
        <PlayButton id={id} title={title} />
      </div>
      <div className="absolute -z-10 h-full w-full before:absolute before:inset-0 before:hidden before:bg-linear-to-r before:from-neutral-950/90 after:absolute after:inset-0 after:bg-linear-to-b after:from-neutral-950/60 after:to-neutral-950 md:before:block md:after:from-transparent md:after:to-neutral-950">
        {background}
      </div>
    </section>
  );
}

function Stars({ nb }: { nb: number }) {
  const normalizedNbStars = Math.round(nb);
  const missingStars = 5 - normalizedNbStars;

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full bg-neutral-950 px-2 py-1 shadow-md">
      {[...Array(normalizedNbStars)].map((_, i) => (
        <StarIcon key={i} className="w-4 text-red-500" />
      ))}
      {[...Array(missingStars)].map((_, i) => (
        <StarIcon key={i} className="w-4 text-neutral-800" />
      ))}
      <span className="text-xs leading-none text-neutral-700 lining-nums tabular-nums contrast-more:text-neutral-300">
        {nb.toPrecision(3)} sur 5
      </span>
    </div>
  );
}

function PlayButton({ id, title }: Pick<Movie, 'id' | 'title'>) {
  return (
    <Button render={<Link href={`/movies/${id}`} />} title={`Lancer ${title}`}>
      <PlayIcon className="w-4" />
      Lancer
    </Button>
  );
}
