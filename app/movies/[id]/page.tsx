import React from 'react';
import Player from '@/components/Player';
import prisma from '@/prisma/prisma';
import { notFound } from 'next/navigation';
import { getMovie } from '@/services/tmdb/movies';

async function retrieveMovieAndThrowIfNotFound(id: number) {
  const movie = await prisma.movie.findUnique({ where: { id } });

  // If movie don't have m3u8 then it's not published already
  if (!movie || !movie.m3u8) {
    notFound();
  }

  try {
    return { movie, tmdb: await getMovie(movie.id) };
  } catch (e) {
    notFound();
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { tmdb } = await retrieveMovieAndThrowIfNotFound(+params.id);

  return {
    title: tmdb.title,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { movie, tmdb } = await retrieveMovieAndThrowIfNotFound(+params.id);

  return (
    <Player id={movie.id} src={movie.m3u8!} title={tmdb.title} poster={tmdb.images.backdrops[0].file_path || ''} />
  );
}

export async function generateStaticParams() {
  const movies = await prisma.movie.findMany({ select: { id: true } });

  return movies.map((movie) => ({ id: String(movie.id) }));
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { tmdb } = await retrieveMovieAndThrowIfNotFound(+params.id);

  return {
    title: tmdb.title,
  };
}

async function retrieveMovieAndThrowIfNotFound(id: number) {
  const movie = await prisma.movie.findUnique({ where: { id } });

  // If movie don't have m3u8 then it's not published already
  if (!movie || !movie.m3u8) {
    notFound();
  }

  try {
    return { movie, tmdb: await getMovie(movie.id) };
  } catch (e) {
    notFound();
  }
}
