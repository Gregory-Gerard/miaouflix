'use client';

import Link from 'next/link';
import Button from '@/components/Button';
import MoviePoster from '@/components/MoviePoster';
import { useState } from 'react';
import { ArrowPathIcon, PlayIcon } from '@heroicons/react/20/solid';
import { Movie } from '@/types/tmdb/movies';

const POSTER_WIDTH = 120;
const GAP = 16;
const STEP = POSTER_WIDTH + GAP;
// Full loops travelled before stopping on the winner. The strip starts on the second copy and keeps one
// extra copy at the end so it never runs dry on either side.
const LOOPS = 3;
const COPIES = LOOPS + 3;

export default function Roulette({ movies }: { movies: Movie[] }) {
  const [pick, setPick] = useState(0);
  const [motion, setMotion] = useState({ offset: -movies.length * STEP, duration: 0 });
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'done'>('idle');
  const [winner, setWinner] = useState<Movie>();

  const spin = () => {
    const next = Math.floor(Math.random() * movies.length);
    setPhase('spinning');
    // Jump back to the second copy without animating, then animate LOOPS copies further on the next frame.
    setMotion({ offset: -(movies.length + pick) * STEP, duration: 0 });
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        setPick(next);
        setMotion({
          offset: -((LOOPS + 1) * movies.length + next) * STEP,
          duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 4500,
        });
      }),
    );
  };

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide">Roulette</h2>
          <p className="text-sm text-neutral-400">Pas envie de choisir ce soir ?</p>
        </div>
        <Button variant="accent" onClick={spin} disabled={phase === 'spinning'} className="shrink-0">
          <ArrowPathIcon className={`w-4 ${phase === 'spinning' ? 'animate-spin' : ''}`} />
          {phase === 'done' ? 'Rejouer' : 'Lancer la roulette'}
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-neutral-900 py-6 shadow-outline">
        <div
          className={`pointer-events-none absolute inset-y-3 left-1/2 z-10 -translate-x-1/2 rounded-xl ring-4 transition-colors ${
            phase === 'done' ? 'shadow-[0_0_40px_var(--color-red-600)] ring-red-500' : 'ring-red-600/60'
          }`}
          style={{ width: POSTER_WIDTH + 12 }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-neutral-900 md:w-48" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-neutral-900 md:w-48" />
        <div
          className="flex gap-4"
          style={{
            marginLeft: `calc(50% - ${POSTER_WIDTH / 2}px)`,
            transform: `translateX(${motion.offset}px)`,
            transition: `transform ${motion.duration}ms cubic-bezier(0.12, 0.8, 0.15, 1)`,
          }}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) {
              setWinner(movies[pick]);
              setPhase('done');
            }
          }}
        >
          {Array.from({ length: COPIES }, (_, copy) =>
            movies.map((movie) => (
              <div key={`${copy}-${movie.id}`} className="shrink-0" style={{ width: POSTER_WIDTH }}>
                <MoviePoster
                  id={movie.id}
                  title={movie.title}
                  src={movie.images.posters[0]?.file_path}
                  loading="eager"
                />
              </div>
            )),
          )}
        </div>
      </div>

      <div
        aria-live="polite"
        className={`-mt-4 grid transition-[grid-template-rows] duration-300 ease-out ${phase === 'done' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
      >
        <div className="overflow-hidden">
          {winner && (
            <div
              key={winner.id}
              className="mt-4 flex animate-fade-in flex-wrap items-center gap-4 rounded-2xl bg-neutral-900 p-4 shadow-outline"
            >
              <div className="w-14 shrink-0">
                <MoviePoster id={winner.id} title={winner.title} src={winner.images.posters[0]?.file_path} />
              </div>
              <div className="min-w-0 grow basis-48">
                <p className="text-xs font-bold tracking-widest text-red-500 uppercase">Ce soir tu regardes</p>
                <strong className="line-clamp-2 text-lg leading-tight">{winner.title}</strong>
                {winner.tagline && <p className="truncate text-sm text-neutral-400">{winner.tagline}</p>}
              </div>
              <Button
                render={<Link href={`/movies/${winner.id}`} />}
                title={`Lancer ${winner.title}`}
                className="grow sm:grow-0"
              >
                <PlayIcon className="w-4" />
                Lancer
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
