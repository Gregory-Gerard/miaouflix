// Usage: node scripts/add-movie.mts [movie.mkv]
import { execFileSync } from 'node:child_process';
import { basename, dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import prismaClient from '@prisma/client';

process.loadEnvFile('.env.local');
const { TMDB_API_URL, TMDB_API_KEY, PROD_DATABASE_URL } = process.env;
if (!TMDB_API_URL || !TMDB_API_KEY || !PROD_DATABASE_URL) {
  throw new Error('TMDB_API_URL, TMDB_API_KEY and PROD_DATABASE_URL are required in .env.local');
}

type SearchResult = { id: number; title: string; original_title: string; release_date: string };

const file = process.argv[2];
const rl = createInterface({ input: process.stdin, output: process.stdout });
const prisma = new prismaClient.PrismaClient({ datasourceUrl: PROD_DATABASE_URL });

const pickIndexes = (answer: string, length: number) =>
  answer
    .split(',')
    .map((value) => Number(value.trim()) - 1)
    .filter((index) => Number.isInteger(index) && index >= 0 && index < length);

const searchMovie = async (): Promise<SearchResult> => {
  // "Monstres.contre.Aliens.2009.MULTI.VF2..." => "Monstres contre Aliens"
  const guess = file
    ? basename(file)
        .split(/[._ ](?:19|20)\d{2}[._ ]/)[0]
        .replace(/[._]/g, ' ')
    : '';
  const query = (await rl.question(`TMDB search${guess ? ` (${guess})` : ''}: `)) || guess;

  const url = new URL(`${TMDB_API_URL}/search/movie`);
  url.search = new URLSearchParams({ api_key: TMDB_API_KEY, language: 'fr-FR', region: 'FR', query }).toString();
  const { results }: { results: SearchResult[] } = await fetch(url).then((res) => res.json());

  if (!results.length) {
    console.log('No results.');
    return searchMovie();
  }

  results.slice(0, 10).forEach((movie, index) => {
    console.log(
      `${index + 1}. ${movie.title} (${movie.release_date.slice(0, 4)}) [${movie.original_title}] #${movie.id}`,
    );
  });
  const [index] = pickIndexes(await rl.question('Movie (empty to search again): '), results.length);

  return index === undefined ? searchMovie() : results[index];
};

const movie = await searchMovie();
const title = `${movie.title} (${movie.release_date.slice(0, 4)})`;

const existing = await prisma.movie.findUnique({ where: { id: movie.id } });
if (existing) {
  console.log(`Already in prod: ${existing.title}`);
}

const categories = await prisma.category.findMany({ orderBy: { order: 'asc' } });
categories.forEach((category, index) => console.log(`${index + 1}. ${category.title}`));
const categoryIds = pickIndexes(await rl.question('Categories (e.g. 1,3): '), categories.length).map(
  (index) => categories[index].id,
);
rl.close();

const m3u8 = `https://miaouflix.s3.fr-par.scw.cloud/movies/${movie.id}/movie.m3u8`;

if (file) {
  const output = join(dirname(file), String(movie.id));
  execFileSync('bash', [join(import.meta.dirname, 'convert.sh'), file, output], { stdio: 'inherit' });
  execFileSync('bash', [join(import.meta.dirname, 'upload.sh'), String(movie.id), output + '/'], { stdio: 'inherit' });

  if (!(await fetch(m3u8, { method: 'HEAD' })).ok) {
    throw new Error(`${m3u8} unreachable, upload failed?`);
  }
}

await prisma.movie.upsert({
  where: { id: movie.id },
  create: { id: movie.id, title, m3u8, categories: { connect: categoryIds.map((id) => ({ id })) } },
  update: { title, m3u8, categories: { set: categoryIds.map((id) => ({ id })) } },
});
await prisma.$disconnect();

console.log(`${title} inserted in prod (#${movie.id})`);
