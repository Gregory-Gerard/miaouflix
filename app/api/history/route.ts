import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getMovie } from '@/services/tmdb/movies';

export async function GET(request: NextRequest) {
  const tmdbIds = z
    .number()
    .array()
    .parse(JSON.parse(request.nextUrl.searchParams.get('tmdbIds') || '[]'));

  const uniqueTmdbIds = [...new Set(tmdbIds)];
  const movies = await Promise.all(uniqueTmdbIds.map((tmdbId) => getMovie(tmdbId)));

  return NextResponse.json(movies);
}
