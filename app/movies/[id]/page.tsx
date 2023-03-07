import React from 'react';
import Player from '@/components/Player';
import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import { getMovie } from '@/services/tmdb/movies';

export default async function Page({ params }: { params: { id: string } }) {
  const id = +params.id;

  const movie = await prisma.movie.findUnique({ where: { id } });

  // If movie don't have m3u8 then it's not published already
  if (!movie || !movie.m3u8) {
    notFound();
  }

  let movieWithTMDBData;

  try {
    movieWithTMDBData = await getMovie(movie.id);
  } catch (e) {
    notFound();
  }

  return (
    <Player
      id={movie.id}
      src={movie.m3u8}
      title={movieWithTMDBData.title}
      poster={movieWithTMDBData.images.backdrops[0].file_path || ''}
    />
  );
}

export async function generateStaticParams() {
  const movies = await prisma.movie.findMany({ select: { id: true } });

  return movies.map((movie) => ({ id: String(movie.id) }));
}
