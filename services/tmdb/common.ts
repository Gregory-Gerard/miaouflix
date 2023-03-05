import invariant from 'ts-invariant';

export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const url = (
  path: string,
  searchParams: Record<string, string> = {}
) => {
  invariant(process.env.TMDB_API_KEY);
  invariant(process.env.TMDB_API_URL);

  const generatedUrl = new URL(
    `${process.env.TMDB_API_URL}/${path.trim().replace(/^\/+/, '')}`
  );

  generatedUrl.searchParams.append('api_key', process.env.TMDB_API_KEY);
  generatedUrl.searchParams.append('language', 'fr-FR');
  generatedUrl.searchParams.append('region', 'FR');

  Object.entries(searchParams).map(([key, value]) =>
    generatedUrl.searchParams.append(key, value)
  );

  return generatedUrl;
};
