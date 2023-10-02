import { FormEvent, useEffect, useId, useReducer, useState } from 'react';
import { addWatchedMovie, getWatchedMovies } from '@/services/watched-movie';
import { fetchData } from '@/services/fetchData';
import { Movie } from '@/types/tmdb/movies';
import { WatchedMovie } from '@/types/watched-movie';

// Load `localStorage` data only on client-side
let watchedMoviesFromLocalStorage: WatchedMovie[] = [];
if (typeof window !== 'undefined') {
  watchedMoviesFromLocalStorage = getWatchedMovies();
}

export default function EditHistoryCard({ refetch }: { refetch: () => void }) {
  const selectId = useId();
  const counterId = useId();
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | undefined>(undefined);

  useEffect(() => {
    const watchedMovieIds = new Set(watchedMoviesFromLocalStorage.map((movie) => movie.tmdbId));

    Movie.array()
      .promise()
      .parse(fetchData(`/api/history?tmdbIds=${JSON.stringify([...watchedMovieIds])}`))
      .then((movies) => setWatchedMovies(movies));
  }, []);

  const [formData, dispatch] = useReducer(
    (
      state: { tmdbId: number | undefined; counter: number },
      payload: { type: 'update'; field: 'tmdbId' | 'counter'; value: number } | never,
    ) => {
      switch (payload.type) {
        case 'update':
          return {
            ...state,
            [payload.field]: payload.value,
          };
      }
    },
    { tmdbId: undefined, counter: 0 },
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setAlert(undefined);

    if (!formData.tmdbId || !formData.counter) {
      setAlert({ type: 'error', message: 'Merci de remplir les champs' });
      return;
    }

    handleSubmit({ tmdbId: formData.tmdbId, counter: formData.counter });
    setAlert({ type: 'success', message: 'Historique mis à jour' });
    refetch();
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <form
        className="relative flex aspect-video flex-col justify-center gap-4 rounded-2xl p-4 shadow-outline"
        onSubmit={onSubmit}
      >
        {alert ? (
          <div
            role="alert"
            className={`rounded-2xl border px-4 py-2 text-sm ${
              alert.type === 'error'
                ? 'border-orange-500/30 bg-orange-500/20 text-orange-50'
                : 'border-green-500/30 bg-green-500/20 text-green-50'
            }`}
          >
            {alert.message}
          </div>
        ) : null}
        <div className="flex flex-col gap-1">
          <label htmlFor={selectId} className="font-semibold">
            Film
          </label>

          <select
            id={selectId}
            className="block rounded-xl border-0 border-neutral-700 bg-neutral-800 px-3 py-2 ring-1 ring-neutral-700 transition-shadow focus:ring-2 focus:ring-red-700"
            defaultValue=""
            onChange={(e) => dispatch({ type: 'update', field: 'tmdbId', value: +e.target.value })}
          >
            <option value="" disabled>
              Sélectionne un film
            </option>
            {watchedMovies.map((movie) => (
              <option value={movie.id} key={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor={counterId} className="font-semibold">
            Compteur
          </label>

          <input
            type="number"
            id={counterId}
            placeholder="Nombre de vues"
            className="block rounded-xl border-0 bg-neutral-800 px-3 py-2 ring-1 ring-neutral-700 transition-shadow focus:ring-2 focus:ring-red-500/10 focus:ring-red-700"
            min={0}
            max={100}
            onChange={(e) => dispatch({ type: 'update', field: 'counter', value: +e.target.value })}
          />
        </div>

        <button className="mt-2 rounded-xl bg-neutral-200 px-8 py-2.5 font-bold text-neutral-950 shadow transition-all hover:bg-neutral-300 hover:shadow-xl focus:outline-0 focus:ring-2 focus:ring-red-700">
          Mettre à jour
        </button>
      </form>
    </div>
  );
}

function handleSubmit(formData: { tmdbId: number; counter: number }) {
  for (let i = 0; i < formData.counter; ++i) {
    addWatchedMovie({ tmdbId: formData.tmdbId, date: new Date() }, false);
  }
}
